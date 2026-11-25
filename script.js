// Constantes globais
const API_URL = "https://winematch-api.gianemolo.workers.dev/";

const DEFAULT_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite"
];

function escapeHtml(valor) {
    const div = document.createElement("div");
    div.textContent = String(valor ?? "");
    return div.innerHTML;
}

// Controlador principal da aplicação
class WineMatchApp {
    constructor() {
        this.currentScanMatch = null;
        this.cameraStream = null;
        this.modoBusca = "prato"; // "prato" busca vinhos | "vinho" busca pratos
    }

    init() {
        this.initAgeVerification();
        this.initLoginDrawer();
        this.initScannerModal();
        this.initDetailsModal();
        this.initSommelierSearch();
        this.initTeclado();
    }

    initTeclado() {
        document.addEventListener("keydown", (e) => {
            if (e.key !== "Escape") return;
            document.querySelectorAll(".modal-overlay.open, .login-drawer-overlay.open").forEach((el) => el.classList.remove("open"));
            document.body.classList.remove("modal-open");
            this.fecharCamera();
        });
    }

    // 1. Verificação de Idade
    initAgeVerification() {
        const ageModal = document.getElementById("age-modal");
        const btnYes = document.getElementById("btn-age-yes");
        const btnNo = document.getElementById("btn-age-no");

        const isVerified = localStorage.getItem("winematch_age_verified");

        if (isVerified === "true") {
            ageModal.classList.add("hidden");
        } else {
            document.body.classList.add("modal-open");
        }

        btnYes.addEventListener("click", () => {
            localStorage.setItem("winematch_age_verified", "true");
            ageModal.classList.add("hidden");
            document.body.classList.remove("modal-open");
        });

        btnNo.addEventListener("click", () => {
            window.location.href = "https://www.google.com";
        });
    }

    // 2. Gaveta de Login
    initLoginDrawer() {
        const loginDrawer = document.getElementById("login-drawer");
        const btnOpen = document.getElementById("btn-open-login");
        const btnClose = document.getElementById("btn-close-login");
        const loginForm = document.getElementById("login-form");
        const googleLogin = document.getElementById("btn-google-login");

        const openDrawer = () => {
            loginDrawer.classList.add("open");
            document.body.classList.add("modal-open");
        };

        const closeDrawer = () => {
            loginDrawer.classList.remove("open");
            if (!document.querySelector(".modal-overlay.open")) {
                document.body.classList.remove("modal-open");
            }
        };

        btnOpen.addEventListener("click", openDrawer);
        btnClose.addEventListener("click", closeDrawer);

        loginDrawer.addEventListener("click", (e) => {
            if (e.target === loginDrawer) closeDrawer();
        });

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.mostrarAviso("O login ainda não está disponível nesta versão.");
            closeDrawer();
        });

        if (googleLogin) {
            googleLogin.addEventListener("click", () => {
                this.mostrarAviso("O login com Google ainda não está disponível.");
                closeDrawer();
            });
        }
    }

    // 3. Scanner de Rótulo (câmera + IA)
    initScannerModal() {
        const scannerModal = document.getElementById("scanner-modal");
        const btnOpen = document.getElementById("btn-scan-label");
        const btnClose = document.getElementById("btn-close-scanner");
        const btnTrigger = document.getElementById("btn-trigger-scan");
        const btnGallery = document.getElementById("btn-scan-gallery");
        const btnRetry = document.getElementById("btn-scan-retry");
        const fileInput = document.getElementById("scanner-file");
        const btnUseScanned = document.getElementById("btn-use-scanned");
        const actions = document.getElementById("scanner-actions");
        const analysisOverlay = document.getElementById("scanner-analysis-overlay");
        const statusText = document.getElementById("scanner-status-text");
        const resultBox = document.getElementById("scanner-result");
        const scannedLabel = document.getElementById("scanned-label");
        const scannedTitle = document.getElementById("scanned-wine-title");
        const scannedDesc = document.getElementById("scanned-desc");
        const video = document.getElementById("scanner-video");
        const preview = document.getElementById("scanner-preview");
        const placeholder = document.getElementById("scanner-placeholder");
        const foodInput = document.getElementById("food-input");

        // Volta para o estado inicial: câmera ligada, sem foto e sem resultado
        const prepararCamera = async () => {
            resultBox.classList.add("hidden");
            analysisOverlay.classList.add("hidden");
            preview.classList.add("hidden");
            actions.classList.remove("hidden");
            this.currentScanMatch = null;

            const ligou = await this.abrirCamera(video);
            video.classList.toggle("hidden", !ligou);
            placeholder.classList.toggle("hidden", ligou);

            if (!ligou) {
                this.mostrarAviso("Não consegui abrir a câmera. Você pode tirar a foto pelo botão abaixo.");
            }
        };

        const openScanner = () => {
            scannerModal.classList.add("open");
            document.body.classList.add("modal-open");
            prepararCamera();
        };

        const closeScanner = () => {
            this.fecharCamera();
            scannerModal.classList.remove("open");
            document.body.classList.remove("modal-open");
        };

        // Recebe a foto (da câmera ou da galeria), mostra na tela e manda para a IA
        const analisar = async (fotoBase64) => {
            this.fecharCamera();
            preview.src = fotoBase64;
            preview.classList.remove("hidden");
            video.classList.add("hidden");
            placeholder.classList.add("hidden");
            actions.classList.add("hidden");
            analysisOverlay.classList.remove("hidden");
            statusText.textContent = "Lendo a imagem...";

            try {
                const leitura = await this.analisarImagem(fotoBase64);
                analysisOverlay.classList.add("hidden");

                if (!["vinho", "prato"].includes(leitura.tipo) || !leitura.nome) {
                    this.mostrarAviso(leitura.observacao || "Não consegui identificar um vinho ou prato nessa foto.");
                    prepararCamera();
                    return;
                }

                this.currentScanMatch = { tipo: leitura.tipo, nome: leitura.nome };
                scannedLabel.textContent = leitura.tipo === "vinho" ? "Vinho identificado:" : "Prato identificado:";
                scannedTitle.textContent = leitura.nome;
                scannedDesc.textContent = leitura.tipo === "vinho"
                    ? "Vamos buscar os pratos que combinam com ele."
                    : "Vamos buscar o vinho que combina com ele.";
                resultBox.classList.remove("hidden");
            } catch (error) {
                console.error("Erro ao analisar a foto:", error);
                analysisOverlay.classList.add("hidden");
                this.mostrarAviso(error.message);
                prepararCamera();
            }
        };

        btnOpen.addEventListener("click", openScanner);
        btnClose.addEventListener("click", closeScanner);

        scannerModal.addEventListener("click", (e) => {
            if (e.target === scannerModal) closeScanner();
        });

        // Botão principal: com a câmera ligada tira a foto; sem câmera abre o seletor do celular
        btnTrigger.addEventListener("click", () => {
            if (this.cameraStream) {
                analisar(this.capturarFoto(video));
            } else {
                fileInput.click();
            }
        });

        btnGallery.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", async () => {
            const arquivo = fileInput.files[0];
            fileInput.value = "";
            if (!arquivo) return;

            try {
                const fotoBase64 = await this.arquivoParaBase64(arquivo);
                analisar(fotoBase64);
            } catch (error) {
                console.error("Erro ao abrir a imagem:", error);
                this.mostrarAviso("Não consegui abrir essa imagem.");
            }
        });

        btnRetry.addEventListener("click", prepararCamera);

        btnUseScanned.addEventListener("click", () => {
            if (this.currentScanMatch) {
                foodInput.value = this.currentScanMatch.nome;
                this.modoBusca = this.currentScanMatch.tipo;
                closeScanner();
                this.consultarSommelier();
            }
        });
    }

    // Liga a câmera traseira (no PC usa a webcam) e mostra no <video>
    async abrirCamera(video) {
        this.fecharCamera();

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return false;
        }

        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
                audio: false
            });
            video.srcObject = this.cameraStream;
            await video.play();
            return true;
        } catch (error) {
            console.warn("Câmera indisponível:", error);
            this.fecharCamera();
            return false;
        }
    }

    // Desliga a câmera (senão a luzinha continua acesa)
    fecharCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach((track) => track.stop());
            this.cameraStream = null;
        }
        const video = document.getElementById("scanner-video");
        if (video) video.srcObject = null;
    }

    // Desenha o quadro atual do vídeo num canvas e devolve a foto em base64
    capturarFoto(video) {
        return this.desenharNoCanvas(video, video.videoWidth, video.videoHeight);
    }

    // Lê uma imagem escolhida na galeria
    arquivoParaBase64(arquivo) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(arquivo);
            const img = new Image();
            img.onload = () => {
                const foto = this.desenharNoCanvas(img, img.naturalWidth, img.naturalHeight);
                URL.revokeObjectURL(url);
                resolve(foto);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Imagem inválida"));
            };
            img.src = url;
        });
    }

    // Reduz a foto para no máximo 1024px no lado maior, para o envio ser rápido
    desenharNoCanvas(origem, largura, altura) {
        const canvas = document.getElementById("scanner-canvas");
        const escala = Math.min(1, 1024 / Math.max(largura, altura));
        canvas.width = Math.round(largura * escala);
        canvas.height = Math.round(altura * escala);
        canvas.getContext("2d").drawImage(origem, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.8);
    }

    // Pergunta para a IA o que aparece na foto
    async analisarImagem(fotoBase64) {
        const prompt = `
            Você é um Sommelier. Analise a foto enviada pelo usuário e classifique o que aparece:
            - "vinho": garrafa ou rótulo de vinho
            - "prato": comida ou prato pronto
            - "outro": qualquer outra coisa, ou uma foto desfocada/escura demais para ler

            Leia apenas o que estiver visível. Não invente produtor, uva ou safra que não aparecem na imagem.
            Se só der para identificar o estilo (ex: um tinto Malbec sem rótulo legível), use um nome genérico.

            Responda EXCLUSIVAMENTE um objeto JSON válido, sem texto extra nem blocos markdown, com esta estrutura:
            {
              "tipo": "vinho, prato ou outro",
              "preco_medio": "faixa de preço média no Brasil em reais, ex: R$ 120 a R$ 160"
              "nome": "Se vinho: nome com produtor, uva e safra quando legíveis. Se prato: nome do prato. Se outro: vazio",
              "observacao": "Uma frase curta explicando o que você viu ou por que não deu para identificar"
            }
        `;

        const base64 = fotoBase64.split(",")[1];
        return this.chamarGemini([
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64 } }
        ]);
    }

    // Envia o conteúdo (texto e/ou imagem) para o Worker e devolve o JSON da resposta
    async chamarGemini(parts) {
        let data = null;

        for (const modelo of DEFAULT_MODELS) {
            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        modelo,
                        corpo: { contents: [{ parts }], generationConfig: { responseMimeType: "application/json" } }
                    })
                });

                if (response.status === 503 || response.status === 429) {
                    console.warn(`Modelo ${modelo} ocupado. Tentando próximo...`);
                    continue;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro na API (${response.status}): ${errorData.error?.message || 'Falha na requisição'}`);
                }

                data = await response.json();
                break;
            } catch (err) {
                if (modelo === DEFAULT_MODELS[DEFAULT_MODELS.length - 1]) throw err;
            }
        }

        if (!data) throw new Error("Servidores do Google temporariamente ocupados. Tente novamente em instantes.");

        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

        return JSON.parse(rawText);
    }

    // 4. Modal de Detalhes e Troca de Abas
    initDetailsModal() {
        const detailsModal = document.getElementById("details-modal");
        const btnOpen = document.getElementById("btn-open-details");
        const btnClose = document.getElementById("btn-close-details");
        const tabBtns = detailsModal.querySelectorAll(".tab-btn");
        const tabPanes = detailsModal.querySelectorAll(".tab-pane");

        if (btnOpen) {
            btnOpen.addEventListener("click", () => {
                detailsModal.classList.add("open");
                document.body.classList.add("modal-open");
            });
        }

        const closeDetails = () => {
            detailsModal.classList.remove("open");
            document.body.classList.remove("modal-open");
        };

        btnClose.addEventListener("click", closeDetails);
        detailsModal.addEventListener("click", (e) => {
            if (e.target === detailsModal) closeDetails();
        });

        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                tabBtns.forEach((b) => b.classList.remove("active"));
                tabPanes.forEach((p) => p.classList.remove("active"));

                btn.classList.add("active");
                const tabTarget = btn.getAttribute("data-tab");
                const activePane = document.getElementById(`tab-${tabTarget}`);
                if (activePane) activePane.classList.add("active");
            });
        });
    }

    // 5. Conexão de Eventos de Busca
    initSommelierSearch() {
        const searchBtn = document.getElementById("sommelier-btn");
        const foodInput = document.getElementById("food-input");
        const copyBtn = document.getElementById("btn-copy-result");

        searchBtn.addEventListener("click", () => this.consultarSommelier());
        foodInput.addEventListener("input", () => { this.modoBusca = "prato"; });
        foodInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") this.consultarSommelier();
        });

        document.querySelectorAll(".chip-prato").forEach((chip) => {
            chip.addEventListener("click", () => {
                foodInput.value = chip.textContent.trim();
                this.modoBusca = "prato";
                this.consultarSommelier();
            });
        });

        copyBtn.addEventListener("click", () => this.copiarHarmonizacao());
    }

    // Chamada Direta à API Gemini com JSON Estruturado
    async consultarSommelier() {
        const input = document.getElementById("food-input").value.trim();
        const searchBtn = document.getElementById("sommelier-btn");
        const loading = document.getElementById("sommelier-loading");
        const resultCard = document.getElementById("sommelier-result");
        const foodsCard = document.getElementById("wine-foods-result");
        const loadingTitle = document.getElementById("sommelier-loading-title");
        const modo = this.modoBusca;

        if (!input) {
            this.mostrarAviso("Digite um prato para buscar a harmonização.");
            return;
        }

        searchBtn.disabled = true;
        loading.style.display = "block";
        resultCard.style.display = "none";
        foodsCard.style.display = "none";
        loadingTitle.textContent = modo === "vinho"
            ? "Escolhendo os pratos para o seu vinho..."
            : "Escolhendo o vinho para o seu prato...";

        document.getElementById("results-section").classList.add("active");
        document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });

        const prompt = `
            Você é um Sommelier e Curador Enogastronômico de alta gastronomia.
            O usuário informou a seguinte refeição ou preferência: "${input}".

            AVALIAÇÃO DE CONTEXTO:
            - Verifique se a mensagem do usuário realmente se refere a comida, bebida, restaurante ou gastronomia.
            - Caso o pedido seja sem sentido, ofensivo ou completamente alheio ao universo gastronômico, responda na chave "harmonizacao" orientando educadamente que informe um prato ou ingrediente para harmonização.

            Os preços devem ser estimativas aproximadas do mercado brasileiro, nunca valores oficiais.

            Responda EXCLUSIVAMENTE um objeto JSON válido, sem texto introdutório, notas ou blocos markdown adicionais, com exatamente a seguinte estrutura:
            {
              "vinho": "Nome do vinho sugerido com variedade e região (ex: Catena Zapata Malbec)",
              "harmonizacao": "Explicação detalhada de por que combina sensorialmente e no paladar com o prato",
              "temperatura": "Temperatura ideal de serviço (ex: 16°C a 18°C)",
              "dica_ambiente": "Dica de ambiente, tipo de taça recomendada e estilo da refeição",
              "preco_medio": "Preço médio de mercado no Brasil (ex: R$ 145,00)",
              "categoria_tier": "Classificação (ex: Custo-Benefício, Seleção Especial ou Premium)",
              "tempo_aeracao": "Tempo de aeração/decantação (ex: 30 minutos em decanter ou Não necessita aeração)",
              "playlist": {
                "nome": "Estilo ou nome sugerido para playlist no Spotify (ex: Bossa Nova & Jantar a Dois)",
                "descricao": "Como essa trilha sonora enriquece a experiência sensorial do vinho e do prato"
              },
              "comparacao_lojas": [
                {
                  "loja": "Nome de loja/e-commerce de vinho (ex: Evino)",
                  "inicial": "E",
                  "preco": "R$ 139,90",
                  "destaque": "Melhor Preço",
                  "tipo_badge": "badge-cheapest"
                },
                {
                  "loja": "Nome de outra loja (ex: Wine.com.br)",
                  "inicial": "W",
                  "preco": "R$ 145,00",
                  "destaque": "Frete Grátis",
                  "tipo_badge": "badge-freeship"
                },
                {
                  "loja": "Nome de terceira loja conceituada (ex: Mistral ou Grand Cru)",
                  "inicial": "M",
                  "preco": "R$ 149,90",
                  "destaque": "Safra Premiada",
                  "tipo_badge": "badge-freeship"
                }
              ]
            }
        `;

        try {
            if (modo === "vinho") {
                const resultado = await this.chamarGemini([{ text: this.montarPromptPratos(input) }]);
                this.renderizarPratos(resultado);
            } else {
                const resultado = await this.chamarGemini([{ text: prompt }]);
                this.renderizarResultado(resultado);
            }
        } catch (error) {
            console.error("Detalhes do erro:", error);
            this.mostrarAviso(error.message);
        } finally {
            searchBtn.disabled = false;
            loading.style.display = "none";
            if (resultCard.style.display === "none" && foodsCard.style.display === "none") document.getElementById("results-section").classList.remove("active");
        }
    }

    // Prompt do caminho inverso: o usuário informou um vinho e quer saber o que servir
    montarPromptPratos(vinho) {
        return `
            Você é um Sommelier e Curador Enogastronômico de alta gastronomia.
            O usuário informou este vinho: "${vinho}".

            Sugira pratos que combinem com ele, pensando em corpo, acidez, taninos e estilo do vinho.
            Se a mensagem não for um vinho, responda no campo "perfil" pedindo educadamente que informe um vinho e deixe "pratos" vazio.

            Responda EXCLUSIVAMENTE um objeto JSON válido, sem texto introdutório nem blocos markdown, com exatamente esta estrutura:
            {
              "vinho": "Nome do vinho com uva e região quando possível",
              "perfil": "Descrição curta do estilo do vinho (corpo, acidez, taninos, aromas)",
              "temperatura": "Temperatura ideal de serviço (ex: 16°C a 18°C)",
              "pratos": [
                { "nome": "Nome curto do prato", "motivo": "Por que combina com esse vinho" }
              ]
            }

            Sugira de 4 a 5 pratos, de preferência variados (carne, massa, queijo, peixe...).
        `;
    }

    // Mostra a lista de pratos sugeridos para o vinho
    renderizarPratos(resultado) {
        const card = document.getElementById("wine-foods-result");
        const lista = document.getElementById("wf-lista");
        const foodInput = document.getElementById("food-input");

        document.getElementById("wf-vinho").textContent = resultado.vinho || "-";
        document.getElementById("wf-perfil").textContent = resultado.perfil || "-";
        document.getElementById("wf-temperatura").textContent = resultado.temperatura || "-";

        lista.innerHTML = "";
        const pratos = Array.isArray(resultado.pratos) ? resultado.pratos : [];

        if (pratos.length === 0) {
            throw new Error(resultado.perfil || "Não consegui sugerir pratos para esse vinho.");
        }

        pratos.forEach((item) => {
            const bloco = document.createElement("div");
            bloco.className = "wm-card";

            const conteudo = document.createElement("div");
            conteudo.className = "wm-card-content";

            const titulo = document.createElement("h4");
            titulo.textContent = item.nome || "-";

            const motivo = document.createElement("p");
            motivo.textContent = item.motivo || "";

            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "wm-btn-secondary wf-btn-buscar";
            botao.textContent = "Ver vinhos para este prato";
            botao.addEventListener("click", () => {
                foodInput.value = item.nome;
                this.modoBusca = "prato";
                this.consultarSommelier();
            });

            conteudo.append(titulo, motivo, botao);
            bloco.appendChild(conteudo);
            lista.appendChild(bloco);
        });

        card.style.display = "block";
    }

    // Renderiza Card e alimenta dinamicamente todas as partes do Modal
    renderizarResultado(resultado) {
        const resultCard = document.getElementById("sommelier-result");

        // 1. Informações no Card Principal
        document.getElementById("res-vinho").textContent = resultado.vinho || "-";
        document.getElementById("res-harmonizacao").textContent = resultado.harmonizacao || "-";
        document.getElementById("res-temperatura").textContent = resultado.temperatura || "-";
        document.getElementById("res-dica").textContent = resultado.dica_ambiente || "-";

        // 2. Lateral do Modal de Detalhes (Nome, Preço e Categoria/Tier)
        document.getElementById("modal-wine-name").textContent = resultado.vinho || "Vinho Sugerido";
        document.getElementById("modal-wine-price").textContent = resultado.preco_medio || "R$ 120,00";
        document.getElementById("modal-wine-tier").textContent = resultado.categoria_tier || "Seleção Especial";

        // 3. Dicas de Serviço
        document.getElementById("modal-wine-temp").textContent = resultado.temperatura || "16°C a 18°C";
        document.getElementById("modal-wine-aeration").textContent = resultado.tempo_aeracao || "Não necessita aeração prévia";

        // 4. Playlist Ideal
        if (resultado.playlist) {
            const playlistTitle = document.getElementById("modal-playlist-title");
            const playlistDesc = document.getElementById("modal-playlist-desc");
            const playlistLink = document.getElementById("modal-playlist-link");

            if (playlistTitle) playlistTitle.textContent = resultado.playlist.nome || "Playlist WineMatch";
            if (playlistDesc) playlistDesc.textContent = resultado.playlist.descricao || "Trilha sonora personalizada para sua refeição.";
            if (playlistLink) {
                const buscaCodificada = encodeURIComponent(resultado.playlist.nome || "Wine Dinner Jazz");
                playlistLink.href = `https://open.spotify.com/search/${buscaCodificada}`;
            }
        }

        // 5. Hub de Comparação de Preços
        const pricesList = document.getElementById("modal-prices-list");
        if (pricesList) {
            pricesList.innerHTML = "";
            const lojas = Array.isArray(resultado.comparacao_lojas) ? resultado.comparacao_lojas : [];

            lojas.forEach((item) => {
                const row = document.createElement("div");
                row.className = "comparison-row";

                const badgeClass = item.tipo_badge === "badge-cheapest" ? "badge-cheapest" : "badge-freeship";
                const linkBusca = `https://www.google.com/search?q=${encodeURIComponent(resultado.vinho + ' ' + item.loja)}`;

                row.innerHTML = `
                    <div class="store-info">
                        <div class="store-logo-placeholder">${escapeHtml(item.inicial || String(item.loja).charAt(0))}</div>
                        <div>
                            <div class="store-name">${escapeHtml(item.loja)}</div>
                            <div class="store-badges"><span class="${badgeClass}">${escapeHtml(item.destaque || "Oferta online")}</span></div>
                        </div>
                    </div>
                    <div class="store-price-action">
                        <div class="store-price">${escapeHtml(item.preco)}</div>
                        <a href="${linkBusca}" target="_blank" rel="noopener noreferrer" class="btn-buy-mock">
                            Ver Oferta
                        </a>
                    </div>
                `;
                pricesList.appendChild(row);
            });
        }

        resultCard.style.display = "block";
    }

    mostrarAviso(mensagem) {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.setAttribute("role", "status");
            document.body.appendChild(toast);
        }
        toast.textContent = mensagem;
        toast.classList.add("show");
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
    }

    copiarHarmonizacao() {
        const vinho = document.getElementById("res-vinho").textContent;
        const harmonizacao = document.getElementById("res-harmonizacao").textContent;
        const temperatura = document.getElementById("res-temperatura").textContent;

        const texto = `${vinho}\n\nPor que combina: ${harmonizacao}\nTemperatura: ${temperatura}\n\nSugestão do WineMatch`;

        navigator.clipboard.writeText(texto).then(() => {
            this.mostrarAviso("Recomendação copiada.");
        }).catch((err) => {
            console.error("Erro ao copiar:", err);
        });
    }
}

// Inicializa a aplicação após o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    const app = new WineMatchApp();
    app.init();
});
