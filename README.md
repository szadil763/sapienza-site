# Sapienza, site e editor de carimbos

Site estático da **Sapienza, Tecnologia Educacional** (Guarulhos/SP). Primeira funcionalidade: o **editor de carimbos personalizados**, que gera o pedido pronto para o WhatsApp.

## Estrutura

```
index.html            home: logo, posicionamento e cartões dos segmentos
carimbos/index.html   editor de carimbos (arquivo único: HTML + CSS + JS)
assets/               logo e símbolo (claro e escuro)
docs/                 roadmap e briefing de continuidade
CLAUDE.md             regras para o Claude Code
```

Sem build, sem dependências, sem banco de dados. Abrir `index.html` no navegador já funciona.

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar no GitHub Pages

1. Criar o repositório (sugestão: `sapienza-site`) e enviar esta pasta.
2. Em **Settings > Pages**, escolher **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O site fica em `https://<usuario>.github.io/<repositorio>/`. O editor fica em `.../carimbos/`.

Todos os caminhos são relativos, então funciona em subpasta e, depois, em domínio próprio.

## Como o pedido funciona

O editor não envia nada para servidor. A cliente monta o carimbo, o editor gera um resumo com um **código de pedido** (`SAP1:` + base64) e abre o WhatsApp com a mensagem pronta. Os dados ficam só no navegador dela e na conversa. O código de pedido é lido pelo projeto da laser (LaserLink) para gerar o arquivo de corte.

## Onde mudar o quê (em `carimbos/index.html`)

| O quê | Onde |
|---|---|
| Número do WhatsApp | constante `ZAP` |
| Preços do kit | constante `PRECOS` (`aberta` e `estojo`, por quantidade 2, 4, 6) |
| Ícones | objeto `ICONES`, nomes em `NOMES`, grupos em `GRUPOS` |
| Frases prontas | objeto `FRASES` |
| Fontes | lista `FONTES` e o `<link>` do Google Fonts |

Preços e prazo são decididos pelo Adilson. Não inventar valores.

## Identidade visual

Amarelo `#F2B400`, vermelho `#E63A2E`, preto `#1B1B1B`, branco `#FFFFFF`, creme `#F2EFE8`. Fonte Poppins. Símbolo em `assets/simbolo-claro.svg` (fundo claro) e `assets/simbolo-escuro.svg` (fundo escuro).
