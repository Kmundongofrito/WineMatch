// Cloudflare Worker do WineMatch: guarda as chaves e conversa com cada IA.
// Segredos (Settings > Variables and Secrets): GEMINI_API_KEY, GROQ_API_KEY,
// CEREBRAS_API_KEY, MISTRAL_API_KEY. Provedor sem chave simplesmente responde erro
// e o site passa para o próximo.

const ORIGENS = [
  "https://kmundongofrito.github.io",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
];

// Só estes modelos são aceitos (evita que outros usem o seu Worker para qualquer coisa)
const MODELOS = {
  gemini: ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"],
  groq: ["openai/gpt-oss-120b", "meta-llama/llama-4-scout-17b-16e-instruct"],
  cerebras: ["gpt-oss-120b"],
  mistral: ["mistral-small-latest"],
};

const COMPATIVEIS = {
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", chave: "GROQ_API_KEY" },
  cerebras: { url: "https://api.cerebras.ai/v1/chat/completions", chave: "CEREBRAS_API_KEY" },
  mistral: { url: "https://api.mistral.ai/v1/chat/completions", chave: "MISTRAL_API_KEY" },
};

class ErroUpstream extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

function resposta(corpo, status, cors) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

async function chamarGemini(env, modelo, prompt, imagem) {
  if (!env.GEMINI_API_KEY) throw new ErroUpstream(401, "Sem chave do Gemini");

  const parts = [{ text: prompt }];
  if (imagem) parts.push({ inlineData: { mimeType: "image/jpeg", data: imagem } });

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseMimeType: "application/json" },
      }),
      signal: AbortSignal.timeout(25000),
    }
  );
  if (!r.ok) throw new ErroUpstream(r.status, `Gemini HTTP ${r.status}`);

  const j = await r.json();
  const partes = j.candidates?.[0]?.content?.parts || [];
  // ignora as partes de "raciocínio" dos modelos que pensam antes de responder
  return partes.filter((p) => !p.thought).map((p) => p.text || "").join("");
}

async function chamarCompativel(env, provedor, modelo, prompt, imagem) {
  const cfg = COMPATIVEIS[provedor];
  const chave = env[cfg.chave];
  if (!chave) throw new ErroUpstream(401, `Sem chave: ${provedor}`);

  const conteudo = imagem
    ? [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imagem}` } },
      ]
    : prompt;

  const corpo = {
    model: modelo,
    messages: [{ role: "user", content: conteudo }],
    response_format: { type: "json_object" },
  };
  // modelos gpt-oss "pensam" antes de responder; esforço baixo = resposta bem mais rápida
  if (modelo.includes("gpt-oss")) corpo.reasoning_effort = "low";

  const r = await fetch(cfg.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${chave}` },
    body: JSON.stringify(corpo),
    signal: AbortSignal.timeout(25000),
  });
  if (!r.ok) throw new ErroUpstream(r.status, `${provedor} HTTP ${r.status}`);

  const j = await r.json();
  return j.choices?.[0]?.message?.content || "";
}

export default {
  async fetch(request, env) {
    const origem = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ORIGENS.includes(origem) ? origem : ORIGENS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return resposta({ error: "Método não permitido" }, 405, cors);

    let dados;
    try {
      dados = await request.json();
    } catch {
      return resposta({ error: "JSON inválido" }, 400, cors);
    }

    const { provedor, modelo, prompt, imagem } = dados;
    const valido =
      MODELOS[provedor]?.includes(modelo) &&
      typeof prompt === "string" &&
      prompt.length > 0 &&
      prompt.length < 8000 &&
      (imagem == null || (typeof imagem === "string" && imagem.length < 4_000_000));

    if (!valido) return resposta({ error: "Pedido inválido" }, 400, cors);

    try {
      const texto =
        provedor === "gemini"
          ? await chamarGemini(env, modelo, prompt, imagem)
          : await chamarCompativel(env, provedor, modelo, prompt, imagem);

      if (!texto) throw new ErroUpstream(502, "Resposta vazia");
      return resposta({ texto }, 200, cors);
    } catch (e) {
      return resposta({ error: e.message }, e.status || 502, cors);
    }
  },
};
