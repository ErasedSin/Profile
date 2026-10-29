const MUSICA_NA_PRIMEIRA_INTERACAO = true;

const video = document.getElementById("fundo");
const musica = document.getElementById("musica");
const botaoMusica = document.getElementById("musica-btn");
const abas = [...document.querySelectorAll("[role=tab]")];
const paineis = [...document.querySelectorAll("[role=tabpanel]")];
const botoesIdioma = [...document.querySelectorAll("[data-idioma]")];

const textosMusica = {
  pt: { ligada: "Música: ligada", desligada: "Música: desligada" },
  en: { ligada: "Music: on", desligada: "Music: off" },
};
const titulos = { pt: "Gaio Moreira - Portfólio", en: "Gaio Moreira - Portfolio" };

let idioma = "pt";
musica.volume = 0.2;

if (matchMedia("(prefers-reduced-motion: reduce)").matches) video.remove();

function abrir(id) {
  abas.forEach((aba) => {
    const ativa = aba.dataset.alvo === id;
    aba.setAttribute("aria-selected", String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
  });
  paineis.forEach((painel) => { painel.hidden = painel.id !== id; });
}

abas.forEach((aba) => aba.addEventListener("click", () => abrir(aba.dataset.alvo)));

document.getElementById("abas").addEventListener("keydown", (e) => {
  const i = abas.indexOf(document.activeElement);
  if (i < 0 || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
  const passo = e.key === "ArrowRight" ? 1 : abas.length - 1;
  const proxima = abas[(i + passo) % abas.length];
  proxima.focus();
  abrir(proxima.dataset.alvo);
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

abrir("sobre");
trocarIdioma("pt");
