const MUSICA_NA_PRIMEIRA_INTERACAO = true;

const video = document.getElementById("fundo");
const musica = document.getElementById("musica");
const botaoMusica = document.getElementById("musica-btn");
const botoesIdioma = [...document.querySelectorAll("[data-idioma]")];
const botoesMenu = [...document.querySelectorAll("[data-abrir]")];
const janelas = [...document.querySelectorAll(".janela")];
const chips = [...document.querySelectorAll(".chip")];
const usoEl = document.getElementById("uso");
const termSaida = document.getElementById("term-saida");
const termEntrada = document.getElementById("term-entrada");

const textosMusica = {
  pt: { ligada: "Música: ligada", desligada: "Música: desligada" },
  en: { ligada: "Music: on", desligada: "Music: off" },
};
const titulos = { pt: "Gaio Moreira - Portfólio", en: "Gaio Moreira - Portfolio" };

const alias = { help: "ajuda", about: "sobre", skills: "habilidades", projects: "projetos", contact: "contato", clear: "limpar" };
const respostas = {
  pt: {
    ajuda: "Comandos: sobre, habilidades, projetos, contato, limpar",
    sobre: "Gaio Moreira. Tecnólogo em ADS e pós-graduando em Engenharia de Software com IA. Busco vaga em suporte técnico ou desenvolvimento júnior.",
    habilidades: "JavaScript, HTML e CSS, Python, Java, C#, C, C++, SQL. Windows, Linux, montagem e diagnóstico de computadores.",
    projetos: "PerfilSelection (página de links interativa) e Sistema de Ordens de Serviço (API em Python, em desenvolvimento).",
    contato: "github.com/ErasedSin | linkedin.com/in/gmoreira777 | gaiomoreira199@gmail.com",
  },
  en: {
    ajuda: "Commands: about, skills, projects, contact, clear",
    sobre: "Gaio Moreira. Technologist in Systems Analysis and Development, pursuing a postgraduate degree in Software Engineering with AI. Looking for a technical support or junior development role.",
    habilidades: "JavaScript, HTML and CSS, Python, Java, C#, C, C++, SQL. Windows, Linux, building and troubleshooting computers.",
    projetos: "PerfilSelection (interactive links page) and Service Orders System (Python API, in progress).",
    contato: "github.com/ErasedSin | linkedin.com/in/gmoreira777 | gaiomoreira199@gmail.com",
  },
};

let idioma = "pt";
let camada = 10;
let cascata = 0;
let chipAtivo = null;

musica.volume = 0.2;
if (matchMedia("(prefers-reduced-motion: reduce)").matches) video.remove();

const movel = () => matchMedia("(max-width: 700px)").matches;
const nomeDe = (janela) => janela.id.replace("janela-", "");
const botaoDe = (janela) => document.querySelector(`[data-abrir="${nomeDe(janela)}"]`);

function trazer(janela) {
  janela.style.zIndex = ++camada;
}

function posicionar(janela) {
  if (janela.dataset.posicionada || movel()) return;
  const largura = janela.offsetWidth;
  const x = Math.min(Math.max(300, innerWidth * 0.3) + cascata * 26, innerWidth - largura - 16);
  const y = Math.min(110 + cascata * 26, Math.max(10, innerHeight - 240));
  janela.style.left = `${Math.max(10, x)}px`;
  janela.style.top = `${y}px`;
  janela.dataset.posicionada = "1";
  cascata = (cascata + 1) % 6;
}

function abrir(nome) {
  const janela = document.getElementById(`janela-${nome}`);
  if (janela.hidden) {
    janela.hidden = false;
    posicionar(janela);
  }
  trazer(janela);
  botaoDe(janela).setAttribute("aria-expanded", "true");
  janela.focus({ preventScroll: true });
}

function fechar(janela) {
  janela.hidden = true;
  const botao = botaoDe(janela);
  botao.setAttribute("aria-expanded", "false");
  botao.focus();
}

botoesMenu.forEach((b) => b.addEventListener("click", () => abrir(b.dataset.abrir)));

janelas.forEach((janela) => {
  const barra = janela.querySelector(".barra");
  janela.addEventListener("pointerdown", () => trazer(janela));
  janela.querySelector(".fechar").addEventListener("click", () => fechar(janela));

  barra.addEventListener("pointerdown", (e) => {
    if (movel() || e.target.closest("button")) return;
    const caixa = janela.getBoundingClientRect();
    const dx = e.clientX - caixa.left;
    const dy = e.clientY - caixa.top;
    const mover = (ev) => {
      janela.style.left = `${Math.min(Math.max(0, ev.clientX - dx), innerWidth - 80)}px`;
      janela.style.top = `${Math.min(Math.max(0, ev.clientY - dy), innerHeight - 40)}px`;
    };
    const soltar = () => {
      removeEventListener("pointermove", mover);
      removeEventListener("pointerup", soltar);
    };
    addEventListener("pointermove", mover);
    addEventListener("pointerup", soltar);
    e.preventDefault();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const abertas = janelas.filter((j) => !j.hidden).sort((a, b) => b.style.zIndex - a.style.zIndex);
  if (abertas.length) fechar(abertas[0]);
});

function mostrarUso() {
  usoEl.textContent = chipAtivo ? (idioma === "pt" ? chipAtivo.dataset.usoPt : chipAtivo.dataset.usoEn) : "";
}

chips.forEach((chip) => chip.addEventListener("click", () => {
  chipAtivo = chip;
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
  mostrarUso();
}));

function escrever(texto) {
  const linha = document.createElement("div");
  linha.textContent = texto;
  termSaida.appendChild(linha);
  termSaida.scrollTop = termSaida.scrollHeight;
}

termEntrada.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const texto = termEntrada.value.trim().toLowerCase();
  termEntrada.value = "";
  if (!texto) return;
  escrever(`> ${texto}`);
  const chave = alias[texto] || texto;
  if (chave === "limpar") {
    termSaida.textContent = "";
    return;
  }
  escrever(respostas[idioma][chave] || (idioma === "pt" ? "Comando não encontrado. Digite ajuda." : "Command not found. Type help."));
});

document.getElementById("previa-btn").addEventListener("click", (e) => {
  const quadro = document.createElement("iframe");
  quadro.src = "https://erasedsin.github.io/PerfilSelection/#v=1&n=Gaio+Moreira&l=gh:ErasedSin&l=ln:gmoreira777&l=pf:https%3A%2F%2Ferasedsin.github.io%2FProfile%2F";
  quadro.title = "PerfilSelection";
  quadro.loading = "lazy";
  quadro.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
  document.getElementById("previa").replaceChildren(quadro);
  e.currentTarget.hidden = true;
});

document.getElementById("copiar-email").addEventListener("click", async (e) => {
  const botao = e.currentTarget;
  try {
    await navigator.clipboard.writeText("gaiomoreira199@gmail.com");
    botao.textContent = idioma === "pt" ? "Copiado!" : "Copied!";
  } catch {
    botao.textContent = idioma === "pt" ? "Copie manualmente" : "Copy manually";
  }
  setTimeout(() => { botao.textContent = botao.dataset[idioma]; }, 1600);
});

function atualizarBotaoMusica() {
  const ligada = !musica.paused;
  botaoMusica.setAttribute("aria-pressed", String(ligada));
  botaoMusica.textContent = textosMusica[idioma][ligada ? "ligada" : "desligada"];
}

function trocarIdioma(novo) {
  idioma = novo;
  document.documentElement.lang = novo === "pt" ? "pt-BR" : "en";
  document.title = titulos[novo];
  document.querySelectorAll("[data-pt]").forEach((el) => { el.textContent = el.dataset[novo]; });
  botoesIdioma.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.idioma === novo)));
  mostrarUso();
  atualizarBotaoMusica();
}

botoesIdioma.forEach((b) => b.addEventListener("click", () => trocarIdioma(b.dataset.idioma)));

function tocar() {
  const promessa = musica.play();
  if (promessa) promessa.catch(() => {});
}

botaoMusica.addEventListener("click", () => {
  if (musica.paused) tocar();
  else musica.pause();
});
musica.addEventListener("play", atualizarBotaoMusica);
musica.addEventListener("pause", atualizarBotaoMusica);

if (MUSICA_NA_PRIMEIRA_INTERACAO) {
  const iniciar = (e) => {
    document.removeEventListener("pointerdown", iniciar);
    if (!e.target.closest("#musica-btn")) tocar();
  };
  document.addEventListener("pointerdown", iniciar);
}

trocarIdioma("pt");
if (!movel()) abrir("sobre");
