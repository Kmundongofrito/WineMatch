// ==========================================================================
// CONSTANTES GLOBAIS (SCREAMING_SNAKE_CASE)
// ==========================================================================
// Insira sua chave de API aqui quando for rodar o projeto localmente
const GEMINI_API_KEY = "AQ.Ab8RN6I3jvlrWgij9wB06wdd5FrJG_qO5e2L495gA2BpmRG7NQ"; 

const DEFAULT_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.4-flash"
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

    // 1. Verificação de Idade (kebab-case nos IDs / camelCase nas variáveis)
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

    // 3. Simulador de Scanner de Rótulo
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

        btnOpen.addEventListener("click", () => {
            detailsModal.classList.add("open");
            document.body.classList.add("modal-open");
        });

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

    // Chamada Direta à API Gemini
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
            alert("Atenção: A chave GEMINI_API_KEY não foi informada no arquivo script.js.");
            return;
        }

        searchBtn.disabled = true;
        loading.style.display = "block";
        resultCard.style.display = "none";

        document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });

        const prompt = `
            Você é um Sommelier profissional. O usuário informou: "${input}".
            Responda EXCLUSIVAMENTE um objeto JSON válido, sem qualquer markdown ou formatação adicional, contendo as chaves:
            "vinho", "harmonizacao", "temperatura", "dica_ambiente". Não aceite "${input}" que não sejam sérios ou que não 
            tenham a ver com o assunto. Caso isso aconteça, responda: "${input}".
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

    renderizarResultado(resultado) {
        const resultCard = document.getElementById("sommelier-result");

        document.getElementById("res-vinho").textContent = resultado.vinho || "-";
        document.getElementById("res-harmonizacao").textContent = resultado.harmonizacao || "-";
        document.getElementById("res-temperatura").textContent = resultado.temperatura || "-";
        document.getElementById("res-dica").textContent = resultado.dica_ambiente || "-";

        document.getElementById("modal-wine-name").textContent = resultado.vinho || "Vinho Sugerido";
        document.getElementById("modal-wine-temp").textContent = resultado.temperatura || "16°C a 18°C";

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