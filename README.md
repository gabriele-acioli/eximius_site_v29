# Landing page EXIMIUS

Projeto separado a partir da V29.

## Estrutura

- `index.html` — estrutura da página
- `css/styles.css` — estilos e responsividade
- `css/custom.css` — ajustes futuros sem alterar o CSS-base
- `js/script.js` — interações
- `assets/images/` — imagens locais
- `assets/videos/` — vídeo atual do hero
- `assets/flickr-sources.json` — links de origem no Flickr

## Desenvolvimento

Abra a pasta no VS Code e rode com Live Server ou outro servidor local.

O vídeo do hero é provisório e pode ser substituído mantendo os nomes `hero-mobile.mp4` e `hero-desktop.mp4`.

Os links `flic.kr/p/...` são páginas de foto, não arquivos de imagem. Por isso o site usa cópias locais para não quebrar os `<img>`. Para servir as fotos diretamente do Flickr, substitua pelos links diretos `live.staticflickr.com/...jpg` e mantenha o link de atribuição exigido pelo Flickr.
testando