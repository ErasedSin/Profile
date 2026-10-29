# Portfólio de Gaio Moreira

Portfólio pessoal com vídeo de fundo, música opcional e troca de idioma entre português e inglês. Mostra habilidades, projetos, formação, cursos, idiomas e contato.

**Site:** https://erasedsin.github.io/Profile/

## Recursos
- Layout responsivo, que funciona no celular e no computador
- Navegação por abas, acessível pelo teclado (Tab e setas)
- Idioma em português e inglês, com troca no topo da página
- Música de fundo que começa no primeiro clique ou toque e pode ser desligada no botão do canto
- Respeita a preferência de movimento reduzido do sistema: nesse caso o vídeo de fundo não é carregado

## Tecnologias
HTML, CSS e JavaScript puro, sem bibliotecas.

## Estrutura
```
index.html       conteúdo da página
css/style.css    visual
js/script.js     abas, idioma e música
video/           vídeo de fundo
music/           música de fundo
```

## Música
Para a música ficar sempre desligada até a pessoa apertar o botão, troque `MUSICA_NA_PRIMEIRA_INTERACAO` para `false` no começo do `js/script.js`. Navegadores não permitem tocar áudio antes de alguma interação da pessoa com a página.

## Rodar localmente
Abra o `index.html` no navegador. Para publicar: Settings > Pages > Deploy from a branch > main / root.

## Créditos
Vídeo de fundo: Huston Skyline, por LennSan.
