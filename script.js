/**
 * WINEMATCH - INTERACTION & SIMULATION LOGIC (VANILLA JS)
 * Senior Front-End Prototype Implementation
 */

// BASE DE DADOS DOS VINHOS (Simulando resposta da IA)
const WINE_DATA = {
    // Vinhos Tintos (Carregados para Carnes/Churrasco/Default)
    red: [
        {
            id: 0,
            name: "Cabernet Sauvignon Nacional",
            price: "R$ 40",
            priceNum: 40,
            tier: "econ",
            tierLabel: "Econômico",
            image: "cabernet_nacional.png",
            body: "70%",
            notes: "Frutas vermelhas, especiarias",
            tannins: "60%",
            acidity: "65%",
            why: "Sua acidez equilibrada e taninos moderados ajudam a cortar a gordura inicial da picanha sem pesar no bolso.",
            rating: "4.0",
            stars: 4,
            service: {
                temp: "16°C a 18°C",
                aeration: "15 minutos (aeração leve)",
                spotify: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO" // Jazz Vibes
            },
            comparison: [
                { store: "Wine.com.br", price: 38.00, badge: "Melhor Preço" },
                { store: "Evino", price: 39.90, badge: "" },
                { store: "Supermercado Pão de Açúcar", price: 44.50, badge: "" },
                { store: "Empório da Bebida", price: 47.00, badge: "" }
            ]
        },
        {
            id: 1,
            name: "Malbec Argentino",
            price: "R$ 90",
            priceNum: 90,
            tier: "inter",
            tierLabel: "Intermediário",
            image: "malbec_argentino.png",
            body: "85%",
            notes: "Ameixa, baunilha, cacau",
            tannins: "80%",
            acidity: "70%",
            why: "O clássico churrasco pede Malbec. Seus taninos maduros e final amadeirado casam perfeitamente com a picanha grelhada.",
            rating: "4.5",
            stars: 4.5,
            service: {
                temp: "17°C a 19°C",
                aeration: "30 minutos (decantar)",
                spotify: "https://open.spotify.com/playlist/37i9dQZF1DX889vygEwbeU" // Wine & Dine
            },
            comparison: [
                { store: "Evino", price: 85.00, badge: "Melhor Preço" },
                { store: "Wine.com.br", price: 89.90, badge: "Frete Grátis" },
                { store: "Imigrantes Bebidas", price: 92.00, badge: "" },
                { store: "Dona Cabral Vinhos", price: 98.90, badge: "" }
            ]
        },
        {
            id: 2,
            name: "Cabernet Sauvignon Reserva",
            price: "R$ 220",
            priceNum: 220,
            tier: "premium",
            tierLabel: "Premium",
            image: "cabernet_reserva.png",
            body: "95%",
            notes: "Tabaco, couro, frutas negras",
            tannins: "90%",
            acidity: "75%",
            why: "Envelhecido em carvalho, possui complexidade ideal para cortes nobres de picanha com maturação prolongada.",
            rating: "4.9",
            stars: 5,
            service: {
                temp: "18°C a 20°C",
                aeration: "45 a 60 minutos (decantar obrigatório)",
                spotify: "https://open.spotify.com/playlist/37i9dQZF1DWV7gfgEvZ57l" // Velvet Jazz
            },
            comparison: [
                { store: "Supermercado Pão de Açúcar", price: 209.00, badge: "Melhor Preço" },
                { store: "Grand Cru", price: 219.90, badge: "Frete Grátis" },
                { store: "Wine.com.br", price: 225.00, badge: "" },
                { store: "Catedral do Vinho", price: 239.00, badge: "" }
            ]
        }
    ],
    // Vinhos Brancos (Carregados para Peixes/Frutos do Mar/Saladas)
    white: [
        {
            id: 0,
            name: "Chardonnay Nacional",
            price: "R$ 45",
            priceNum: 45,
            tier: "econ",
            tierLabel: "Econômico",
            image: "cabernet_nacional.png", // Reutiliza a garrafa nacional no protótipo
            body: "40%",
            notes: "Maçã verde, abacaxi, toque mineral",
            tannins: "10%",
            acidity: "75%",
            why: "A acidez refrescante corta a leve untuosidade do peixe sem mascarar o sabor delicado da carne branca.",
            rating: "4.1",
            stars: 4,
            service: {
                temp: "8°C a 10°C",
                aeration: "Não necessita aeração",
                spotify: "https://open.spotify.com/playlist/37i9dQZF1DWT375WJ2v96T" // Acoustic Covers
            },
            comparison: [
                { store: "Supermercado Pão de Açúcar", price: 42.00, badge: "Melhor Preço" },
                { store: "Wine.com.br", price: 45.00, badge: "" },
                { store: "Evino", price: 45.90, badge: "" },
                { store: "Imigrantes Bebidas", price: 48.00, badge: "" }
            ]
        },
        {
            id: 1,
            name: "Sauvignon Blanc Importado",
            price: "R$ 95",
            priceNum: 95,
            tier: "inter",
            tierLabel: "Intermediário",
            image: "malbec_argentino.png", // Reutiliza garrafa intermediária no protótipo
            body: "45%",
            notes: "Maracujá, ervas frescas, limão siciliano",
            tannins: "12%",
            acidity: "85%",
            why: "Notas cítricas e herbáceas vibrantes que funcionam como um espremer de limão natural sobre frutos do mar grelhados.",
            rating: "4.6",
            stars: 4.5,
            service: {
                temp: "9°C a 11°C",
                aeration: "Não necessita aeração",
                spotify: "https://open.spotify.com/playlist/37i9dQZF1DX2sQHbtMmqr6" // Bossa Nova Beats
            },
            comparison: [
                { store: "Wine.com.br", price: 89.90, badge: "Melhor Preço" },
                { store: "Evino", price: 95.00, badge: "Frete Grátis" },
                { store: "Bebida Fácil", price: 99.00, badge: "" },
                { store: "Mercado Livre", price: 104.90, badge: "" }
            ]
        },
        {
            id: 2,
            name: "Chardonnay Reserva Barricado",
            price: "R$ 240",
            priceNum: 240,
            tier: "premium",
            tierLabel: "Premium",
            image: "cabernet_reserva.png", // Reutiliza garrafa premium no protótipo
            body: "70%",
            notes: "Manteiga, avelã, baunilha, pêssego",
            tannins: "15%",
            acidity: "70%",
            why: "Envelhecido em carvalho, possui cremosidade e peso em boca perfeito para peixes gordos (como salmão) ou molhos amanteigados.",
            rating: "4.8",
            stars: 5,
            service: {
                temp: "10°C a 12°C",
                aeration: "10 minutos na taça antes de servir",
                spotify: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp" // Lounge Classical
            },
            comparison: [
                { store: "Grand Cru", price: 235.00, badge: "Melhor Preço" },
                { store: "Wine.com.br", price: 240.00, badge: "Frete Grátis" },
                { store: "Mistral", price: 248.00, badge: "" },
                { store: "Empório do Vinho", price: 260.00, badge: "" }
            ]
        }
    ]
};

// Armazenamento do resultado atual carregado na tela
let currentActiveSet = "red"; // 'red' ou 'white'

// INICIALIZAÇÃO E EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    initAgeVerification();
    initLoginDrawer();
    initSearchLogic();
    initDetailsModal();
    initScannerModal();
});

// ==========================================
// 1. VERIFICAÇÃO DE MAIORIDADE (IDADE MODAL)
// ==========================================
function initAgeVerification() {
    const ageModal = document.getElementById("age-modal");
    const btnYes = document.getElementById("btn-age-yes");
    const btnNo = document.getElementById("btn-age-no");

    // Verificar se já passou na verificação antes
    const isVerified = localStorage.getItem("winematch-age-verified");

    if (isVerified === "true") {
        ageModal.classList.add("hidden");
    } else {
        document.body.classList.add("modal-open");
    }

    btnYes.addEventListener("click", () => {
        localStorage.setItem("winematch-age-verified", "true");
        ageModal.classList.add("hidden");
        document.body.classList.remove("modal-open");
    });

    btnNo.addEventListener("click", () => {
        // Redireciona para um site neutro ou exibe tela de bloqueio
        window.location.href = "https://www.google.com";
    });
}

// ==========================================
// 2. GAVETA LATERAL DE LOGIN
// ==========================================
function initLoginDrawer() {
    const loginDrawer = document.getElementById("login-drawer");
    const btnOpen = document.getElementById("btn-open-login");
    const btnClose = document.getElementById("btn-close-login");
    const loginForm = document.getElementById("login-form");
    const googleLogin = document.getElementById("btn-google-login");

    function openDrawer() {
        loginDrawer.classList.add("open");
        document.body.classList.add("modal-open");
    }

    function closeDrawer() {
        loginDrawer.classList.remove("open");
        // Remove bloqueio de scroll apenas se não houver outros modais abertos
        if (!document.querySelector(".modal-overlay.open")) {
            document.body.classList.remove("modal-open");
        }
    }

    btnOpen.addEventListener("click", openDrawer);
    btnClose.addEventListener("click", closeDrawer);

    // Fechar ao clicar fora do painel
    loginDrawer.addEventListener("click", (e) => {
        if (e.target === loginDrawer) {
            closeDrawer();
        }
    });

    // Submissão do Formulário de Login (Simulado)
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        alert(`Login efetuado com sucesso para: ${email}!\n(Este é um protótipo de interface)`);
        closeDrawer();
    });

    // Login com Google (Simulado)
    googleLogin.addEventListener("click", () => {
        alert("Simulação de Login via Google efetuada com sucesso!");
        closeDrawer();
    });
}

// ==========================================
// 3. SIMULAÇÃO DE BUSCA E INTELIGÊNCIA ARTIFICIAL
// ==========================================
function initSearchLogic() {
    const foodInput = document.getElementById("food-input");
    const btnSearch = document.getElementById("btn-search-match");
    const loader = document.getElementById("search-loader");
    const cardsContainer = document.getElementById("cards-container");
    const targetDisplay = document.getElementById("target-food-display");
    const resultsDesc = document.querySelector(".results-desc");

    function performSearch() {
        const query = foodInput.value.trim().toLowerCase();
        if (query === "") return;

        // Ativa animação de carregamento
        loader.classList.remove("hidden");
        cardsContainer.classList.add("hidden");

        // Simula delay de análise da IA (1.2 segundos)
        setTimeout(() => {
            loader.classList.add("hidden");
            cardsContainer.classList.remove("hidden");
            targetDisplay.textContent = foodInput.value;

            // Lógica Reativa: Identifica o prato para servir tintos ou brancos
            const whiteWineKeywords = [
                "peixe", "salmao", "salmão", "frutos do mar", "camarao", "camarão", 
                "lagosta", "bacalhau", "frango", "aves", "carbonara", "salada", "sushi"
            ];

            // Verifica se a busca contém alguma palavra-chave de vinho branco
            const matchesWhite = whiteWineKeywords.some(keyword => query.includes(keyword));

            if (matchesWhite) {
                currentActiveSet = "white";
                resultsDesc.textContent = `A leveza do prato "${foodInput.value}" pede vinhos brancos frescos com boa acidez e notas frutadas/minerais para complementar o paladar.`;
            } else {
                currentActiveSet = "red";
                resultsDesc.textContent = `Vinhos tintos encorpados com boa estrutura de taninos e acidez são ideais para limpar a gordura e equilibrar o sabor robusto do prato "${foodInput.value}".`;
            }

            renderWineCards();
            
            // Rolagem suave até a seção de resultados
            document.getElementById("results-section").scrollIntoView({ behavior: 'smooth' });
        }, 1200);
    }

    btnSearch.addEventListener("click", performSearch);

    // Permite buscar apertando 'Enter' no input
    foodInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            performSearch();
        }
    });
}

// RENDERIZAÇÃO DINÂMICA DOS CARDS COM BASE NA BUSCA
function renderWineCards() {
    const cardsContainer = document.getElementById("cards-container");
    const dataset = WINE_DATA[currentActiveSet];
    cardsContainer.innerHTML = "";

    dataset.forEach((wine) => {
        // Criar estrelas de avaliação
        let starsHTML = "";
        const fullStars = Math.floor(wine.stars);
        const hasHalf = wine.stars % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            } else if (i === fullStars && hasHalf) {
                starsHTML += '<i class="fa-solid fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
        }

        const card = document.createElement("div");
        card.className = `wine-card ${wine.tier}-card`;
        card.setAttribute("data-tier", wine.tier);

        // Define o ícone do badge com base no tier
        let badgeIcon = "fa-leaf";
        if (wine.tier === "inter") badgeIcon = "fa-award";
        if (wine.tier === "premium") badgeIcon = "fa-crown";

        card.innerHTML = `
            <div class="wine-card-badge tier-${wine.tier === 'econ' ? 'green' : wine.tier === 'inter' ? 'gold' : 'red'}">
                <i class="fa-solid ${badgeIcon}"></i> ${wine.tierLabel}
            </div>
            <div class="wine-img-container">
                <img src="${wine.image}" alt="${wine.name}" class="wine-bottle-img">
            </div>
            <div class="wine-card-body">
                <h3 class="wine-name">${wine.name}</h3>
                <div class="wine-price">Preço médio: <strong>${wine.price}</strong></div>
                
                <div class="wine-specs">
                    <div class="spec-row">
                        <span class="spec-label">Corpo</span>
                        <div class="spec-bar"><div class="spec-fill" style="width: ${wine.body};"></div></div>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Notas</span>
                        <span class="spec-value">${wine.notes}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Taninos</span>
                        <div class="spec-bar"><div class="spec-fill" style="width: ${wine.tannins};"></div></div>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Acidez</span>
                        <div class="spec-bar"><div class="spec-fill" style="width: ${wine.acidity};"></div></div>
                    </div>
                </div>
                
                <div class="why-match">
                    <h4>Por que combina?</h4>
                    <p>${wine.why}</p>
                </div>
                
                <div class="rating-stars">
                    ${starsHTML}
                    <span class="rating-value">(${wine.rating})</span>
                </div>
                
                <button class="btn-gold btn-full btn-details-trigger" data-wine="${wine.id}">Ver detalhes</button>
            </div>
        `;

        cardsContainer.appendChild(card);
    });

    // Re-vincula os cliques dos botões de detalhes recém-gerados
    bindDetailsTriggers();
}

// ==========================================
// 4. MODAL DE DETALHES (DICAS DE SERVIÇO & PREÇOS)
// ==========================================
function initDetailsModal() {
    const modal = document.getElementById("details-modal");
    const closeBtn = modal.querySelector(".modal-close-btn");
    const tabs = modal.querySelectorAll(".tab-btn");
    const panes = modal.querySelectorAll(".tab-pane");

    // Fecha modal no clique do botão fechar
    closeBtn.addEventListener("click", closeModal);

    // Fecha modal ao clicar no overlay/fundo
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Alternar Abas (Tabs) do Modal
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            const targetPane = document.getElementById(`tab-${tab.getAttribute("data-tab")}`);
            targetPane.classList.add("active");
        });
    });

    bindDetailsTriggers();
}

function bindDetailsTriggers() {
    const triggers = document.querySelectorAll(".btn-details-trigger");
    triggers.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const wineId = parseInt(btn.getAttribute("data-wine"));
            openDetailsModal(wineId);
        });
    });
}

function openDetailsModal(id) {
    const modal = document.getElementById("details-modal");
    const dataset = WINE_DATA[currentActiveSet];
    const wine = dataset.find(w => w.id === id);

    if (!wine) return;

    // Atualiza Informações Básicas
    document.getElementById("modal-wine-name").textContent = wine.name;
    document.getElementById("modal-wine-price").textContent = wine.price;
    document.getElementById("modal-wine-image").src = wine.image;
    document.getElementById("modal-wine-image").alt = wine.name;

    // Estiliza o badge de categoria
    const tierBadge = document.getElementById("modal-wine-tier");
    tierBadge.textContent = wine.tierLabel;
    tierBadge.className = "modal-wine-badge"; // limpa classes
    
    if (wine.tier === "econ") {
        tierBadge.classList.add("tier-green");
    } else if (wine.tier === "inter") {
        tierBadge.classList.add("tier-gold");
    } else {
        tierBadge.classList.add("tier-red");
    }

    // Tab Dicas de Serviço
    document.getElementById("modal-wine-temp").textContent = wine.service.temp;
    document.getElementById("modal-wine-aeration").textContent = wine.service.aeration;
    const spotifyBtn = modal.querySelector(".btn-spotify");
    spotifyBtn.href = wine.service.spotify;

    // Tab Comparador de Preços (Montagem Dinâmica da Lista)
    const pricesList = document.getElementById("modal-prices-list");
    pricesList.innerHTML = "";

    wine.comparison.forEach((item) => {
        const row = document.createElement("div");
        row.className = "comparison-row";

        // Cria selos de destaque
        let badgesHTML = "";
        if (item.badge === "Melhor Preço") {
            badgesHTML = `<span class="badge-cheapest">${item.badge}</span>`;
        } else if (item.badge === "Frete Grátis") {
            badgesHTML = `<span class="badge-freeship">${item.badge}</span>`;
        }

        row.innerHTML = `
            <div class="store-info">
                <div class="store-logo-placeholder">${item.store.charAt(0)}</div>
                <div>
                    <div class="store-name">${item.store}</div>
                    <div class="store-badges">${badgesHTML}</div>
                </div>
            </div>
            <div class="store-price-action">
                <div class="store-price">R$ ${item.price.toFixed(2)}</div>
                <button class="btn-buy-mock" onclick="alert('Redirecionando para a loja parceira ${item.store} (Simulação)...')">Ir para Loja</button>
            </div>
        `;
        pricesList.appendChild(row);
    });

    // Reseta para a primeira aba (Dicas de Serviço) ao abrir
    modal.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
    modal.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    modal.querySelector('[data-tab="service"]').classList.add("active");
    document.getElementById("tab-service").classList.add("active");

    // Mostra o Modal
    modal.classList.add("open");
    document.body.classList.add("modal-open");
}

function closeModal() {
    document.getElementById("details-modal").classList.remove("open");
    document.getElementById("scanner-modal").classList.remove("open");
    document.body.classList.remove("modal-open");
}

// ==========================================
// 5. SIMULADOR DE SCANNER DE RÓTULO
// ==========================================
function initScannerModal() {
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

    // Banco de rótulos simulados para escanear
    const mockScannedWines = [
        { title: "Chardonnay Gran Reserva 2021", food: "Salmão Grelhado" },
        { title: "Barolo DOCG 2018", food: "Costela de Cordeiro" },
        { title: "Alvarinho Reserva 2022", food: "Bacalhau à Portuguesa" },
        { title: "Chianti Classico DOCG 2019", food: "Massa à Bolonhesa" }
    ];

    let currentScanMatch = null;

    btnOpen.addEventListener("click", () => {
        scannerModal.classList.add("open");
        document.body.classList.add("modal-open");
        resetScannerState();
    });

    btnClose.addEventListener("click", closeModal);

    // Fechar ao clicar no overlay
    scannerModal.addEventListener("click", (e) => {
        if (e.target === scannerModal) {
            closeModal();
        }
    });

    function resetScannerState() {
        resultBox.classList.add("hidden");
        analysisOverlay.classList.add("hidden");
        btnTrigger.style.display = "inline-flex";
    }

    // Gatilho de Escaneamento Animado
    btnTrigger.addEventListener("click", () => {
        btnTrigger.style.display = "none";
        analysisOverlay.classList.remove("hidden");
        
        // Fase 1: Análise
        statusText.textContent = "Iniciando câmera...";
        
        setTimeout(() => {
            statusText.textContent = "Focalizando rótulo da garrafa...";
        }, 600);

        setTimeout(() => {
            statusText.textContent = "Consultando base de vinhos por IA...";
        }, 1200);

        // Fase 2: Resultados
        setTimeout(() => {
            analysisOverlay.classList.add("hidden");
            
            // Escolhe um vinho escaneado aleatoriamente da lista
            const randomIndex = Math.floor(Math.random() * mockScannedWines.length);
            currentScanMatch = mockScannedWines[randomIndex];

            scannedTitle.textContent = currentScanMatch.title;
            resultBox.classList.remove("hidden");
        }, 2000);
    });

    // Carregar Prato Recomendado no Buscador
    btnUseScanned.addEventListener("click", () => {
        if (currentScanMatch) {
            foodInput.value = currentScanMatch.food;
            closeModal();
            
            // Dispara a busca automaticamente no site
            document.getElementById("btn-search-match").click();
        }
    });
}

const GEMINI_API_KEY = ""; 

async function consultarSommelier() {
  const input = document.getElementById("foodInput").value.trim();
  const btn = document.getElementById("sommelierBtn");
  const loading = document.getElementById("sommelierLoading");
  const resultCard = document.getElementById("sommelierResult");

  if (!input) {
    alert("Por favor, digite o prato ou vinho!");
    return;
  }

  btn.disabled = true;
  loading.style.display = "block";
  resultCard.style.display = "none";

  const prompt = `
    Você é um Sommelier profissional. O usuário informou: "${input}".
    Responda EXCLUSIVAMENTE um objeto JSON válido, sem qualquer texto antes ou depois, com as chaves:
    "vinho", "harmonizacao", "temperatura", "dica_ambiente".
  `;

  // Lista de modelos para tentar caso um esteja em pico de demanda
  const modelos = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.4-flash"];
  let data = null;

  try {
    for (const modelo of modelos) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        // Se for erro de alta demanda (503) ou limite de taxa (429), tenta o próximo modelo da lista
        if (response.status === 503 || response.status === 429) {
          console.warn(`Modelo ${modelo} ocupado. Tentando próximo...`);
          continue; 
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro na API (${response.status}): ${errorData.error?.message || 'Chave ou requisição inválida'}`);
        }

        data = await response.json();
        break; // Sucesso! Sai do loop de tentativas
      } catch (err) {
        // Se for o último modelo e falhar, lança o erro
        if (modelo === modelos[modelos.length - 1]) throw err;
      }
    }

    if (!data) throw new Error("Servidores do Google temporariamente ocupados. Tente novamente em alguns segundos.");

    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const resultado = JSON.parse(rawText);

    document.getElementById("resVinho").innerText = resultado.vinho || "-";
    document.getElementById("resHarmonizacao").innerText = resultado.harmonizacao || "-";
    document.getElementById("resTemperatura").innerText = resultado.temperatura || "-";
    document.getElementById("resDica").innerText = resultado.dica_ambiente || "-";

    resultCard.style.display = "block";
  } catch (error) {
    console.error("Detalhes do erro:", error);
    alert(error.message);
  } finally {
    btn.disabled = false;
    loading.style.display = "none";
  }
}

function copiarHarmonizacao() {
  const vinho = document.getElementById("resVinho").innerText;
  const harmonizacao = document.getElementById("resHarmonizacao").innerText;
  const temp = document.getElementById("resTemperatura").innerText;
  
  const texto = `🍷 ${vinho}\n🍽️ Harmonização: ${harmonizacao}\n🌡️ Temperatura: ${temp}\nEncontrado no WineMatch!`;
  
  navigator.clipboard.writeText(texto).then(() => {
    alert("Recomendação copiada para a área de transferência!");
  });
}