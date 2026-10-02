# Landing page EXIMIUS

Landing page institucional da escola EXIMIUS. Apresenta a proposta pedagógica,
estrutura de laboratórios, vídeos, informações de contato e um formulário de
interesse em matrículas. O projeto é uma página estática; o envio do formulário
depende da futura integração com um backend.

## Tecnologias

- HTML5 sem framework ou processo de compilação.
- CSS3, com estilos principais e regras de customização/responsividade.
- JavaScript nativo para navegação, animações, carrosséis, modal, mandala e
  interações do formulário.
- Google Fonts e Google Maps incorporados por serviços externos.
- Imagens e vídeo locais em `assets/`.

Não há `package.json`, dependências npm, testes automatizados nem etapa de
build configurada. O conteúdo publicado é servido diretamente como arquivos
estáticos.

## Estrutura do projeto

```text
.
├── index.html
├── README.md
├── css/
│   ├── styles.css
│   └── custom.css
├── js/
│   ├── script.js
│   ├── custom.js
│   └── form-integration.js
└── assets/
    ├── images/
    │   ├── branding/
    │   ├── directors/
    │   ├── hero/
    │   ├── mission/
    │   ├── partners/
    │   ├── projects/
    │   ├── results/
    │   ├── structure/
    │   ├── testimonials/
    │   └── trajectory/
    ├── videos/
    └── flickr-sources.json
```

- `index.html`: estrutura da página, metadados, referências aos assets,
  formulário e modal de matrículas.
- `css/styles.css`: estilos da página e suas variantes responsivas.
- `css/custom.css`: ajustes e customizações adicionais da interface.
- `js/script.js`: interações gerais, incluindo a mandala e o modal.
- `js/custom.js`: scripts complementares da página.
- `js/form-integration.js`: ponto único para validação e futura conexão do
  formulário ao backend; atualmente não transmite os dados.
- `assets/images/`: fotografias, ilustrações e demais imagens.
- `assets/videos/`: vídeo do hero para desktop.
- `assets/flickr-sources.json`: registro de fontes/origens de imagens.

Mantenha os nomes e caminhos dos arquivos referenciados no HTML, CSS e
JavaScript. Se um asset for movido ou convertido, atualize todas as referências
e confira o carregamento na página.

## Executar localmente

É possível abrir `index.html` diretamente, mas recomenda-se servir a pasta por
HTTP para reproduzir melhor o ambiente de produção. Com Python instalado,
execute na raiz do projeto:

```sh
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador. Encerre o servidor com `Ctrl+C`.
O servidor local serve apenas os arquivos estáticos: não há API nem envio real
do formulário.

## Publicação

O site pode ser hospedado em um serviço de arquivos estáticos ou em um servidor
web convencional. Publique a raiz do projeto preservando a estrutura de
diretórios e configure o host para servir `index.html` na raiz do domínio.
Não é necessário executar build.

Antes de anunciar o endereço oficial, definir o domínio canônico e completar
os metadados sociais (`canonical`, Open Graph e Twitter, se aplicável) e o
favicon oficial da escola. Eles não foram inventados porque dependem do domínio
e dos materiais oficiais da identidade visual.

### Configurações recomendadas no host

- Disponibilizar a página somente por HTTPS e redirecionar HTTP para HTTPS.
- Configurar cabeçalhos de segurança adequados à hospedagem, incluindo
  `Content-Security-Policy`, `X-Content-Type-Options` e `Referrer-Policy`.
- Na política CSP, permitir apenas as origens externas realmente utilizadas:
  Google Fonts, Google Maps e os destinos externos de navegação. Testar a
  política no domínio publicado, pois fontes e mapa dependem dessas origens.
- Não publicar arquivos `.env`, chaves privadas, credenciais ou configurações
  internas do backend na pasta pública.

## Formulário de matrículas

O formulário visual está no modal `#visitModal`, em `index.html`, e é
identificado por `#visitForm`. Os controles usam os seguintes nomes e IDs:

| Dado | `name` | `id` | Validação no navegador |
| --- | --- | --- | --- |
| Nome | `nome` | `visitName` | Obrigatório |
| E-mail | `email` | `visitEmail` | Obrigatório e formato de e-mail |
| WhatsApp | `whatsapp` | `visitWhatsapp` | Obrigatório |
| Mensagem | `mensagem` | `visitMessage` | Obrigatória |

`js/form-integration.js` registra o evento `submit`, impede o envio padrão,
verifica `checkValidity()` e apresenta as mensagens nativas de validação do
navegador. O texto de status está associado a `#visitFormNote`. No momento, o
script apresenta somente uma mensagem informativa de que a integração será
conectada: **nenhum dado é enviado, armazenado ou encaminhado**.

### Integração do backend do formulário

O próximo desenvolvedor deve trabalhar em `js/form-integration.js`. Esse é o
ponto previsto para substituir o placeholder por uma requisição à API definida
pela equipe responsável pelo backend. Não existe endpoint configurado neste
repositório e nenhum endpoint deve ser presumido.

O contrato inicial dos dados, obtido dos campos do formulário, é:

```json
{
  "nome": "string",
  "email": "string",
  "whatsapp": "string",
  "mensagem": "string"
}
```

Usar os nomes acima no payload, salvo acordo documentado com o backend. Ao
implementar a integração:

1. Confirmar com a equipe de backend a URL HTTPS, método HTTP, formato do corpo,
   resposta de sucesso/erro e eventual autenticação. Configurar a URL pública
   da API sem incluir segredos no JavaScript.
2. No handler `submit` existente em `js/form-integration.js`, preservar
   `preventDefault()` e a validação cliente. Ler os campos do formulário,
   construir o payload e enviar usando `fetch` para o endpoint confirmado.
3. Exibir estados acessíveis de envio, sucesso e erro em `#visitFormNote`;
   impedir envios repetidos enquanto a requisição estiver em andamento e
   restaurar o botão/estado em `finally`. Não comunicar sucesso antes de uma
   resposta de sucesso do servidor.
4. Tratar respostas HTTP não bem-sucedidas, indisponibilidade de rede e erros
   de validação do servidor sem apagar os dados preenchidos. Não registrar
   mensagens, e-mails ou telefones pessoais no console.
5. Se frontend e API estiverem em origens diferentes, configurar CORS no
   servidor para permitir somente os domínios oficiais necessários.

Validação feita no navegador melhora a experiência, mas não é uma barreira de
segurança. O backend deve validar tipo, formato, tamanho e conteúdo de todos os
campos; aplicar proteção contra abuso/spam e rate limiting; evitar injeção e
saída HTML insegura; usar HTTPS; definir retenção, acesso e descarte dos dados
pessoais conforme a LGPD; e retornar erros que não exponham detalhes internos.
Publicar aviso de privacidade e informar a finalidade e o tratamento dos dados
antes de ativar o recebimento real de matrículas.

## Responsividade e manutenção visual

- Testar os breakpoints existentes em celulares, tablets e desktop; verificar
  que não há rolagem horizontal nem conteúdo cortado.
- Fazer alterações de estilo nas regras e breakpoints existentes, evitando
  overrides duplicados e preservando a distinção entre desktop e mobile.
- Ao mexer em animações ou na mandala, preservar as interações e testar sair da
  seção e retornar a ela; a imagem deve permanecer carregada e visível.
- Não substituir imagens transparentes por formatos sem transparência. Ao
  otimizar ou redimensionar uma imagem, comparar dimensões, proporção, cores,
  transparência e aparência em escala real.
- O vídeo atual é `assets/videos/hero-desktop.mp4`; não há um arquivo
  `hero-mobile.mp4` no projeto. Avaliar o peso e carregamento em conexões móveis
  durante a manutenção, sem introduzir referências a arquivos inexistentes.
- Depois de alterar caminhos, conferir todos os links, imagens, fontes, vídeo,
  mapa e destinos externos no navegador.

## Checklist de deploy

- [ ] Confirmar o domínio oficial, HTTPS e redirecionamento de HTTP.
- [ ] Definir canonical e metadados de compartilhamento com URLs oficiais.
- [ ] Adicionar o favicon oficial fornecido pela escola.
- [ ] Publicar e testar todos os arquivos e assets preservando seus caminhos.
- [ ] Confirmar a política CSP e demais cabeçalhos no host, incluindo os
      recursos de terceiros realmente usados.
- [ ] Testar navegação, âncoras, links externos, vídeo, modal, teclado e
      formulários em navegadores e tamanhos de tela representativos.
- [ ] Verificar console, erros de rede, imagens ausentes, overflow e desempenho
      no domínio de produção.
- [ ] Antes de habilitar matrículas, implementar e testar o backend, estados de
      envio/sucesso/erro, validação no servidor, proteção contra spam e CORS.
- [ ] Publicar aviso de privacidade e confirmar o tratamento de dados pessoais
      com a escola.
- [ ] Confirmar que nenhum segredo, arquivo local ou configuração de
      desenvolvimento foi publicado.
