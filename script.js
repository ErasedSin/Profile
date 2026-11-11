(() => {
  const NOME = "GAIO 'ERASED' MOREIRA";
  const INICIAIS = [0, 14];
  const APELIDO = [5, 6, 7, 8, 9, 10, 11, 12];
  const GLIFOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_-<>";

  const body = document.body;
  const intro = document.getElementById("intro");
  const nomeEl = document.getElementById("intro-nome");
  const logo = document.getElementById("logo");
  const linhas = [...intro.querySelectorAll(".intro-linha")];
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const TITULOS = ".rotulo, .hero-titulo > span, .secao-titulo > span, .sobre-texto h3, .sub, .metodo h4, .projeto-num, .projeto h4, .grupo h4, .caso dt, .dados dt";
  const CORRIDOS = ".hero-texto, .sobre-texto > p, .lista li, .dados dd, .metodo p, .projeto-resumo, .caso dd, .credito, .dica, .linha-tempo strong, .onde, .contato-texto";
  const escrevendo = new Map();
  let observadorEscrita = null;
  let escritaIniciada = false;

  const escapar = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function animarEscrita(el, embaralhar) {
    const original = el.innerHTML;
    const final = el.textContent.replace(/\s+/g, " ").trim();
    const total = final.length;
    const duracao = embaralhar ? Math.min(900, 300 + total * 18) : Math.min(1200, 250 + total * 4);
    const token = {};
    escrevendo.set(el, { token, original });
    el.classList.remove("por-escrever");
    const inicio = performance.now();

    const passo = (agora) => {
      const atual = escrevendo.get(el);
      if (!atual || atual.token !== token) return;
      const p = Math.min((agora - inicio) / duracao, 1);
      if (p >= 1) {
        el.innerHTML = original;
        escrevendo.delete(el);
        return;
      }
      const n = Math.floor(total * p);
      let meio = "";
      if (embaralhar) {
        for (let i = n; i < Math.min(total, n + 3); i++) meio += final[i] === " " ? " " : glifo();
      }
      const marca = embaralhar ? `<span class="glifo">${escapar(meio)}</span>` : '<span class="cursor-bloco"></span>';
      el.innerHTML = escapar(final.slice(0, n)) + marca + `<span class="fantasma">${escapar(final.slice(n + meio.length))}</span>`;
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  function pararEscrita() {
    escrevendo.forEach(({ original }, el) => { el.innerHTML = original; });
    escrevendo.clear();
    if (observadorEscrita) observadorEscrita.disconnect();
    document.querySelectorAll(".por-escrever").forEach((el) => el.classList.remove("por-escrever"));
  }

  function iniciarEscrita() {
    if (escritaIniciada || semMovimento || !("IntersectionObserver" in window)) return;
    escritaIniciada = true;
    const simples = (el) => el.children.length === 0 && el.textContent.trim();
    const titulos = new Set([...document.querySelectorAll(TITULOS)].filter(simples));
    const corridos = [...document.querySelectorAll(CORRIDOS)].filter(simples);

    observadorEscrita = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        observadorEscrita.unobserve(e.target);
        animarEscrita(e.target, titulos.has(e.target));
      });
    }, { threshold: 0.4 });

    [...titulos, ...corridos].forEach((el) => {
      el.classList.add("por-escrever");
      observadorEscrita.observe(el);
    });
  }

  const ler = (chave) => { try { return localStorage.getItem(chave); } catch (e) { return null; } };
  const gravar = (chave, valor) => { try { localStorage.setItem(chave, valor); } catch (e) {} };

  let idioma = ler("idioma") === "en" ? "en" : "pt";

  const TEXTOS = {
    pt: {
      copiado: "E-mail copiado.",
      falhaCopia: "Não deu para copiar. O e-mail é ",
      usadoEm: "Onde usei: ",
      terminalBoasVindas: "Digite ajuda para ver os comandos.",
      desconhecido: "Comando não encontrado. Digite ajuda.",
      ajuda: "Comandos: sobre, projetos, habilidades, contato, github, curriculo, idioma, limpar, sair",
      sobre: "Gaio Moreira. Tecnólogo em ADS, pós-graduando em Engenharia de Software com IA.\nSuporte técnico e desenvolvimento. Nova Iguaçu, RJ.",
      contato: "E-mail: gaiomoreira199@gmail.com\nLinkedIn: linkedin.com/in/gmoreira777\nGitHub: github.com/ErasedSin",
      abrindo: "Abrindo...",
    },
    en: {
      copiado: "E-mail copied.",
      falhaCopia: "Couldn't copy. The e-mail is ",
      usadoEm: "Where I used it: ",
      terminalBoasVindas: "Type help to see the commands.",
      desconhecido: "Command not found. Type help.",
      ajuda: "Commands: about, projects, skills, contact, github, resume, language, clear, exit",
      sobre: "Gaio Moreira. Systems Analysis and Development graduate, postgraduate student in Software Engineering with AI.\nTechnical support and development. Nova Iguaçu, RJ, Brazil.",
      contato: "E-mail: gaiomoreira199@gmail.com\nLinkedIn: linkedin.com/in/gmoreira777\nGitHub: github.com/ErasedSin",
      abrindo: "Opening...",
    },
  };

  const t = (chave) => TEXTOS[idioma][chave];

  document.querySelectorAll("[data-en]").forEach((el) => { el.dataset.pt = el.innerHTML.trim(); });

  function aplicarIdioma(novo) {
    idioma = novo;
    gravar("idioma", novo);
    document.documentElement.lang = novo === "en" ? "en" : "pt-BR";
    pararEscrita();
    document.querySelectorAll("[data-en]").forEach((el) => {
      el.innerHTML = novo === "en" ? el.dataset.en : el.dataset.pt;
    });
    document.querySelectorAll("[data-idioma]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.idioma === novo));
    });
    const ativo = document.querySelector('.chip[aria-pressed="true"]');
    if (ativo) mostrarUso(ativo);
  }

  document.querySelectorAll("[data-idioma]").forEach((b) => {
    b.addEventListener("click", () => aplicarIdioma(b.dataset.idioma));
  });

  if (idioma === "en") aplicarIdioma("en");

  let execucao = 0;

  const esperar = (ms, id) => new Promise((ok, falha) => {
    setTimeout(() => (id === execucao ? ok() : falha()), ms);
  });

  const glifo = () => GLIFOS[Math.floor(Math.random() * GLIFOS.length)];

  const OPERACOES = [
    "COLD BOOT", "KERNEL PANIC", "BLUE SCREEN", "STACK OVERFLOW", "SAFE MODE",
    "NULL POINTER", "HOTFIX", "DEAD PIXEL", "LAST COMMIT", "BACKUP PROTOCOL",
  ];
  const MESES = {
    pt: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],
    en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  };

  function prepararCabecalho() {
    const agora = new Date();
    const diaDoAno = Math.round((Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate()) - Date.UTC(agora.getFullYear(), 0, 0)) / 864e5);
    const dois = (n) => String(n).padStart(2, "0");
    const hora = `${dois(agora.getHours())}:${dois(agora.getMinutes())}:${dois(agora.getSeconds())}`;
    const data = (lingua) => `${dois(agora.getDate())} ${MESES[lingua][agora.getMonth()]} ${agora.getFullYear()}`;
    const dia = document.getElementById("intro-dia");
    dia.dataset.texto = `DIA ${String(diaDoAno).padStart(3, "0")} — ${data("pt")} — ${hora}`;
    dia.dataset.textoEn = `DAY ${String(diaDoAno).padStart(3, "0")} — ${data("en")} — ${hora}`;

    const operacao = OPERACOES[Math.floor(Math.random() * OPERACOES.length)];
    const op = document.getElementById("intro-operacao");
    op.dataset.texto = `OPERAÇÃO "${operacao}"`;
    op.dataset.textoEn = `OPERATION "${operacao}"`;
  }

  const textoDaLinha = (el) => (idioma === "en" ? el.dataset.textoEn : el.dataset.texto);

  async function digitar(el, texto, id, passo = 38) {
    el.classList.add("cursor");
    let pronto = "";
    for (const c of texto) {
      if (c !== " ") {
        for (let i = 0; i < 2; i++) {
          el.textContent = pronto + glifo();
          await esperar(passo / 2, id);
        }
      }
      pronto += c;
      el.textContent = pronto;
      await esperar(passo, id);
    }
    el.classList.remove("cursor");
  }

  async function digitarNome(id) {
    nomeEl.textContent = "";
    nomeEl.classList.add("cursor");
    const letras = [];
    for (const c of NOME) {
      const span = document.createElement("span");
      span.className = "letra";
      nomeEl.appendChild(span);
      letras.push(span);
      if (c !== " ") {
        for (let i = 0; i < 3; i++) {
          span.textContent = glifo();
          await esperar(28, id);
        }
      }
      span.textContent = c;
      await esperar(55, id);
    }
    nomeEl.classList.remove("cursor");
    return letras;
  }

  function limpar() {
    linhas.forEach((l) => { l.textContent = ""; l.classList.remove("cursor"); });
    nomeEl.textContent = "";
    nomeEl.classList.remove("cursor");
    document.querySelectorAll(".voador").forEach((v) => v.remove());
  }

  function terminar() {
    execucao++;
    intro.classList.add("saindo");
    body.classList.remove("intro-ativa");
    document.querySelectorAll(".voador").forEach((v) => v.remove());
    document.removeEventListener("keydown", teclaPular);
    try { sessionStorage.setItem("intro-vista", "1"); } catch (e) {}
    iniciarEscrita();
  }

  function teclaPular(e) {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") terminar();
  }

  async function voarParaLogo(letras, id) {
    const g = letras[INICIAIS[0]].getBoundingClientRect();
    const voador = document.createElement("p");
    voador.className = "voador";
    voador.textContent = "GM";
    voador.style.left = g.left + "px";
    voador.style.top = g.top + "px";
    voador.style.fontSize = getComputedStyle(nomeEl).fontSize;
    body.appendChild(voador);
    nomeEl.style.visibility = "hidden";

    const alvo = logo.getBoundingClientRect();
    await esperar(30, id);
    const curva = ".8s cubic-bezier(.7,0,.2,1)";
    voador.style.transition = `left ${curva}, top ${curva}, font-size ${curva}`;
    voador.style.left = alvo.left + "px";
    voador.style.top = alvo.top + "px";
    voador.style.fontSize = getComputedStyle(logo).fontSize;
    intro.classList.add("saindo");
    await esperar(820, id);
  }

  async function rodarIntro() {
    const id = ++execucao;
    limpar();
    nomeEl.style.visibility = "";
    intro.classList.remove("saindo");
    body.classList.add("intro-ativa");
    window.scrollTo(0, 0);
    document.addEventListener("keydown", teclaPular);

    try {
      prepararCabecalho();
      await esperar(500, id);
      for (const linha of linhas.slice(0, 4)) {
        await digitar(linha, textoDaLinha(linha), id);
        await esperar(linha.id === "intro-operacao" ? 450 : 180, id);
      }
      const letras = await digitarNome(id);
      await digitar(linhas[4], textoDaLinha(linhas[4]), id, 26);
      await esperar(900, id);

      letras.forEach((l, i) => l.classList.add(APELIDO.includes(i) ? "fica" : "some"));
      await esperar(1300, id);

      letras.forEach((l, i) => {
        l.classList.remove("fica", "some");
        l.classList.add(INICIAIS.includes(i) ? "fica" : "some");
      });
      await esperar(800, id);

      await voarParaLogo(letras, id);
      terminar();
    } catch (e) {
      return;
    }
  }

  document.getElementById("intro-pular").addEventListener("click", terminar);
  document.getElementById("rever-intro").addEventListener("click", rodarIntro);

  let jaViu = false;
  try { jaViu = sessionStorage.getItem("intro-vista") === "1"; } catch (e) {}

  if (semMovimento || jaViu) {
    terminar();
  } else {
    rodarIntro();
  }

  const uso = document.getElementById("uso");
  const chips = [...document.querySelectorAll(".chip")];

  function mostrarUso(chip) {
    const texto = idioma === "en" ? chip.dataset.usoEn : chip.dataset.uso;
    uso.innerHTML = "";
    const nome = document.createElement("strong");
    nome.textContent = chip.textContent + ". ";
    uso.append(nome, t("usadoEm") + texto);
  }

  chips.forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      const jaAtivo = chip.getAttribute("aria-pressed") === "true";
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      if (jaAtivo) {
        uso.textContent = "";
        return;
      }
      chip.setAttribute("aria-pressed", "true");
      mostrarUso(chip);
    });
  });

  const botaoEmail = document.getElementById("copiar-email");
  const aviso = document.getElementById("aviso");
  botaoEmail.addEventListener("click", async () => {
    const email = botaoEmail.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      aviso.textContent = t("copiado");
    } catch (e) {
      aviso.textContent = t("falhaCopia") + email;
    }
    setTimeout(() => { aviso.textContent = ""; }, 3000);
  });

  const terminal = document.getElementById("terminal");
  const saida = document.getElementById("terminal-saida");
  const entrada = document.getElementById("terminal-entrada");

  function escrever(texto, classe) {
    const linha = document.createElement("div");
    if (classe) linha.className = classe;
    linha.textContent = texto;
    saida.appendChild(linha);
    saida.scrollTop = saida.scrollHeight;
  }

  function irPara(seletor) {
    document.querySelector(seletor).scrollIntoView({ behavior: semMovimento ? "auto" : "smooth" });
  }

  const COMANDOS = {
    ajuda: () => escrever(t("ajuda")),
    sobre: () => escrever(t("sobre")),
    projetos: () => {
      document.querySelectorAll(".projeto h4").forEach((h, i) => escrever(`${String(i + 1).padStart(2, "0")}  ${h.textContent}`));
    },
    habilidades: () => irPara("#habilidades"),
    contato: () => escrever(t("contato")),
    github: () => { escrever(t("abrindo")); window.open("https://github.com/ErasedSin", "_blank", "noopener"); },
    curriculo: () => { escrever(t("abrindo")); window.open("curriculo.pdf", "_blank", "noopener"); },
    idioma: () => aplicarIdioma(idioma === "pt" ? "en" : "pt"),
    limpar: () => { saida.textContent = ""; },
    sair: () => { terminal.hidden = true; },
  };

  const APELIDOS = {
    help: "ajuda", about: "sobre", projects: "projetos", skills: "habilidades",
    contact: "contato", resume: "curriculo", "currículo": "curriculo",
    language: "idioma", clear: "limpar", cls: "limpar", exit: "sair",
  };

  function abrirTerminal() {
    terminal.hidden = false;
    if (!saida.childElementCount) escrever(t("terminalBoasVindas"));
    terminal.scrollIntoView({ behavior: semMovimento ? "auto" : "smooth", block: "center" });
    entrada.focus({ preventScroll: true });
  }

  document.getElementById("abrir-terminal").addEventListener("click", abrirTerminal);
  document.getElementById("fechar-terminal").addEventListener("click", () => { terminal.hidden = true; });

  document.getElementById("terminal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = entrada.value.trim();
    entrada.value = "";
    if (!texto) return;
    escrever("> " + texto, "eco");
    const nome = texto.toLowerCase().split(/\s+/)[0];
    const comando = COMANDOS[APELIDOS[nome] || nome];
    if (comando) comando();
    else escrever(t("desconhecido"));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "`" && !body.classList.contains("intro-ativa") && document.activeElement !== entrada) {
      e.preventDefault();
      abrirTerminal();
    }
  });

  if (!semMovimento && "IntersectionObserver" in window) {
    const alvos = document.querySelectorAll(".secao-titulo, .sobre, .metodo li, .projeto, .grupo, .formacao > div, .placar div");
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          observador.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    alvos.forEach((a) => { a.classList.add("revelar"); observador.observe(a); });

    const observaNumero = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        observaNumero.unobserve(e.target);
        const fim = parseFloat(e.target.dataset.contar);
        const casas = (e.target.dataset.contar.split(".")[1] || "").length;
        const inicio = performance.now();
        const passo = (agora) => {
          const p = Math.min((agora - inicio) / 1200, 1);
          e.target.textContent = (fim * (1 - Math.pow(1 - p, 3))).toFixed(casas);
          if (p < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-contar]").forEach((c) => observaNumero.observe(c));
  }
})();
