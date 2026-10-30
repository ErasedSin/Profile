# Portfólio de Gaio Moreira

Portfólio interativo em formato de desktop: um vídeo ocupa a tela inteira, e cada seção abre em uma janela que pode ser arrastada e fechada.

**Site:** https://erasedsin.github.io/Profile/

## Recursos
- Janelas arrastáveis (no celular viram painéis na parte de baixo da tela)
- Habilidades clicáveis, que mostram onde cada uma foi usada
- Pré-visualização do projeto PerfilSelection dentro da própria página
- Terminal interativo: digite `ajuda`
- Português e inglês, com troca no canto superior direito
- Música de fundo que começa no primeiro clique ou toque, com botão para desligar
- Acessível pelo teclado (Tab, Enter e Esc para fechar a janela da frente)
- Respeita a preferência de movimento reduzido do sistema: o vídeo de fundo não é carregado

## Tecnologias
HTML, CSS e JavaScript puro, sem bibliotecas.

## Estrutura
```
index.html         conteúdo das janelas
css/portfolio.css  visual
js/portfolio.js    janelas, idioma, terminal e música
video/             vídeo de fundo
music/             música de fundo
```

## Música
Para a música ficar desligada até a pessoa apertar o botão, troque `MUSICA_NA_PRIMEIRA_INTERACAO` para `false` no começo do `js/portfolio.js`. Navegadores não permitem tocar áudio antes de alguma interação com a página.

## Publicar
Settings > Pages > Deploy from a branch > main / root.

## Créditos
Vídeo de fundo: Huston Skyline, por LennSan.
