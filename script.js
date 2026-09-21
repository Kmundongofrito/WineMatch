// ==========================================================================
// CONSTANTES GLOBAIS (SCREAMING_SNAKE_CASE)
// ==========================================================================
const GEMINI_API_KEY = ""; 

const DEFAULT_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite"
];

const MOCK_SCANNED_WINES = [
    { title: "Chardonnay Gran Reserva 2021", food: "Salmão Grelhado" },
    { title: "Barolo DOCG 2018", food: "Costela de Cordeiro" },
    { title: "Alvarinho Reserva 2022", food: "Bacalhau à Portuguesa" },
    { title: "Chianti Classico DOCG 2019", food: "Massa à Bolonhesa" }
];

// ==========================================================================
// CONTROLADOR PRINCIPAL DA APLICAÇÃO (PascalCase)
// ==========================================================================
class WineMatchApp {
    constructor() {
        this.currentScanMatch = null;
    }

    init() {
        this.initAgeVerification();
        this.initLoginDrawer();
        this.initScannerModal();
        this.initDetailsModal();
        this.initSommelierSearch();
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
            const email = document.getElementById("login-email").value;
            alert(`Login efetuado com sucesso para: ${email}`);
            closeDrawer();
        });

        if (googleLogin) {
            googleLogin.addEventListener("click", () => {
                alert("Simulação de Login via Google efetuada!");
                closeDrawer();
            });
        }
    }

    // 3. Scanner de Rótulo
    initScannerModal() {
        const scannerModal = document.getElementById("scanner-modal");
        const btnOpen = document.getElementById("btn-scan-label");
        const btnClose = document.getElementById("btn-close-scanner");
        const btnTrigger = document.getElementById("btn-trigger-scan");
        const btnUseScanned = document.getElementById("btn-use-scanned");
        const analysisOverlay = document.getElementById("scanner-analysis-overlay");
        const statusText = document.getElementById("scanner-status-text");
        const resultBox = document.getElementById("scanner-result");
        const scannedTitle = document.getElementById("scanned-wine-title");
        const foodInput = document.getElementById("food-input");

        const openScanner = () => {
            scannerModal.classList.add("open");
            document.body.classList.add("modal-open");
            resultBox.classList.add("hidden");
            analysisOverlay.classList.add("hidden");
            btnTrigger.style.display = "inline-flex";
        };

        const closeScanner = () => {
            scannerModal.classList.remove("open");
            document.body.classList.remove("modal-open");
        };

        btnOpen.addEventListener("click", openScanner);
        btnClose.addEventListener("click", closeScanner);

        scannerModal.addEventListener("click", (e) => {
            if (e.target === scannerModal) closeScanner();
        });

        btnTrigger.addEventListener("click", () => {
            btnTrigger.style.display = "none";
            analysisOverlay.classList.remove("hidden");

            statusText.textContent = "Iniciando câmera...";
            setTimeout(() => { statusText.textContent = "Focalizando rótulo da garrafa..."; }, 600);
            setTimeout(() => { statusText.textContent = "Consultando base de sommelier..."; }, 1200);

            setTimeout(() => {
                analysisOverlay.classList.add("hidden");
                const randomIndex = Math.floor(Math.random() * MOCK_SCANNED_WINES.length);
                this.currentScanMatch = MOCK_SCANNED_WINES[randomIndex];

                scannedTitle.textContent = this.currentScanMatch.title;
                resultBox.classList.remove("hidden");
            }, 2000);
        });

        btnUseScanned.addEventListener("click", () => {
            if (this.currentScanMatch) {
                foodInput.value = this.currentScanMatch.food;
                closeScanner();
                this.consultarSommelier();
            }
        });
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
        foodInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") this.consultarSommelier();
        });

        copyBtn.addEventListener("click", () => this.copiarHarmonizacao());
    }

    // Chamada Direta à API Gemini com JSON Estruturado
    async consultarSommelier() {
        const input = document.getElementById("food-input").value.trim();
        const searchBtn = document.getElementById("sommelier-btn");
        const loading = document.getElementById("sommelier-loading");
        const resultCard = document.getElementById("sommelier-result");

        if (!input) {
            alert("Por favor, digite o prato ou vinho desejado!");
            return;
        }

        if (!GEMINI_API_KEY) {
            alert("Atenção: A chave GEMINI_API_KEY não foi configurada.");
            return;
        }

        searchBtn.disabled = true;
        loading.style.display = "block";
        resultCard.style.display = "none";

        document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });

        const prompt = `
            Você é um Sommelier e Curador Enogastronômico de alta gastronomia.
            O usuário informou a seguinte refeição ou preferência: "${input}".

            AVALIAÇÃO DE CONTEXTO:
            - Verifique se a mensagem do usuário realmente se refere a comida, bebida, restaurante ou gastronomia.
            - Caso o pedido seja sem sentido, ofensivo ou completamente alheio ao universo gastronômico, responda na chave "harmonizacao" orientando educadamente que informe um prato ou ingrediente para harmonização.

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

        let data = null;

        try {
            for (const modelo of DEFAULT_MODELS) {
                try {
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${GEMINI_API_KEY}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                        }
                    );

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

            const resultado = JSON.parse(rawText);
            this.renderizarResultado(resultado);
        } catch (error) {
            console.error("Detalhes do erro:", error);
            alert(error.message);
        } finally {
            searchBtn.disabled = false;
            loading.style.display = "none";
        }
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

        // 3. Dicas de Serviço (Temperatura e Aeração gerados pela IA)
        document.getElementById("modal-wine-temp").textContent = resultado.temperatura || "16°C a 18°C";
        document.getElementById("modal-wine-aeration").textContent = resultado.tempo_aeracao || "Não necessita aeração prévia";

        // 4. Playlist Ideal (Gerada pela IA com link de busca direta no Spotify)
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

        // 5. Hub de Comparação de Preços (Gerado dinamicamente com lojas da IA)
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
                        <div class="store-logo-placeholder">${item.inicial || item.loja.charAt(0)}</div>
                        <div>
                            <div class="store-name">${item.loja}</div>
                            <div class="store-badges"><span class="${badgeClass}">${item.destaque || "Oferta Online"}</span></div>
                        </div>
                    </div>
                    <div class="store-price-action">
                        <div class="store-price">${item.preco}</div>
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

    copiarHarmonizacao() {
        const vinho = document.getElementById("res-vinho").textContent;
        const harmonizacao = document.getElementById("res-harmonizacao").textContent;
        const temperatura = document.getElementById("res-temperatura").textContent;

        const texto = `🍷 ${vinho}\n🍽️ Harmonização: ${harmonizacao}\n🌡️ Temperatura: ${temperatura}\nEncontrado no WineMatch!`;

        navigator.clipboard.writeText(texto).then(() => {
            alert("Recomendação copiada para a área de transferência!");
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
