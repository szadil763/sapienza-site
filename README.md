# Sapienza, site e editor de carimbos

Site estático da **Sapienza, Tecnologia Educacional** (Guarulhos/SP). Primeira funcionalidade: o **editor de carimbos personalizados**, que gera o pedido pronto para o WhatsApp.

## Estrutura

```
index.html            home: logo, segmentos, como funciona e botão de WhatsApp
carimbos/index.html   vitrine animada do kit (caixas, demonstração, preços)
carimbos/monte/       editor de carimbos (arquivo único: HTML + CSS + JS)
assets/               logo, símbolo (claro e escuro) e imagem de compartilhamento
sitemap.xml, robots.txt
docs/                 roadmap e briefing de continuidade
CLAUDE.md             regras para o Claude Code
```

Sem build, sem dependências, sem banco de dados. Abrir `index.html` no navegador já funciona.

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Testes automáticos

```bash
npm i -g playwright && npx playwright install chromium   # só na primeira vez
node tests/site.test.js
```

Abre a home, a vitrine e o editor em 360 e 1280 px no Chromium e confere:
- todos os botões e opções do editor;
- o código `SAP1:`/`SAP2:` (ordem dos campos, linha 3 no 7º elemento com prefixo `SAP2:`, ida e volta pelo botão Carregar);
- que códigos incompletos ou adulterados são recusados;
- a passagem do kit escolhido da vitrine para o editor;
- que os preços da vitrine batem com os do editor;
- alvos de toque de 44 px e ausência de rolagem lateral.

Rodar antes de publicar.

## Publicar no GitHub Pages

1. Criar o repositório (sugestão: `sapienza-site`) e enviar esta pasta.
2. Em **Settings > Pages**, escolher **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O site fica em `https://<usuario>.github.io/<repositorio>/`. A vitrine fica em `.../carimbos/` e o editor em `.../carimbos/monte/`.

Todos os caminhos são relativos, então funciona em subpasta e, depois, em domínio próprio.

## Como o pedido funciona

O editor não envia nada para servidor. A cliente monta o carimbo, o editor gera um resumo com um **código de pedido** (`SAP1:` + base64) e abre o WhatsApp com a mensagem pronta. Os dados ficam só no navegador dela e na conversa. O código de pedido é lido pelo projeto da laser (LaserLink) para gerar o arquivo de corte.

Formato: `SAP1:` + base64 de `{k,s,c,b,u}`. `k` é a quantidade (2, 4 ou 6), `c` o nome na caixa, `b` o modelo (`aberta` ou `estojo`), `u` cidade ou CEP. Cada item de `s` é `[linha1, linha2, fonte, ícone, lado, moldura]`. Quando o carimbo tem **linha 3**, ela vem como 7º elemento: `[linha1, linha2, fonte, ícone, lado, moldura, linha3]`. Quando algum carimbo tem linha 3, o código começa com **`SAP2:`** em vez de `SAP1:` (o resto do formato é igual), para que um LaserLink que só conhece o `SAP1:` recuse o código em vez de cortar sem a linha 3. Sem linha 3, o código continua `SAP1:` com 6 elementos por carimbo, igual ao formato antigo. O botão Carregar aceita os dois.

## Onde mudar o quê (em `carimbos/monte/index.html`)

| O quê | Onde |
|---|---|
| Número do WhatsApp | constante `ZAP` |
| Preços do kit | constante `PRECOS` (`aberta` e `estojo`, por quantidade 2, 4, 6) |
| Ícones | objeto `ICONES`, nomes em `NOMES`, grupos em `GRUPOS` |
| Simulação 3D da caixa | função `renderSim` (medidas aproximadas, só ilustração) |
| Frases prontas | objeto `FRASES` |
| Fontes | lista `FONTES` e o `<link>` do Google Fonts |

Os preços também aparecem na tabela da vitrine (`carimbos/index.html`): ao mudar, mudar nos dois lugares. As fotos das caixas ficam em `assets/carimbos/`. O botão "Monte o seu carimbo" abre o editor já com o tamanho de kit escolhido (`monte/?n=2`, `4` ou `6`).

Ao criar um ícone novo, a chave dele (ex.: `formiguinha`) vai no código `SAP1:`. O LaserLink precisa ter o mesmo desenho com a mesma chave para gerar o arquivo de corte.

Preços e prazo são decididos pelo Adilson. Não inventar valores.

## Endereço do site (SEO e domínio)

As tags `og:url`, `og:image` e `canonical`, o `sitemap.xml` e o `robots.txt` precisam do endereço completo. Hoje usam `https://szadil763.github.io/sapienza-site/`. Ao trocar para domínio próprio, procurar esse endereço em todos os arquivos e substituir pelo novo. A imagem de compartilhamento é `assets/og-sapienza.png` (1200 × 630).

O `robots.txt` só é lido pelos buscadores na raiz do domínio, então ele passa a valer de fato com o domínio próprio.

## Identidade visual

Amarelo `#F2B400`, vermelho `#E63A2E`, preto `#1B1B1B`, branco `#FFFFFF`, creme `#F2EFE8`. Fonte Poppins. Símbolo em `assets/simbolo-claro.svg` (fundo claro) e `assets/simbolo-escuro.svg` (fundo escuro).
