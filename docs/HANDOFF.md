# Briefing para continuar no Claude Code

Cole o texto abaixo em uma conversa nova do Claude Code aberta na pasta do repositório.

---

## Contexto
Sou o Adilson, professor de Matemática (SEDUC-SP) e de Programação e Robótica (SESI-SP), com 25 anos de CNC, em Guarulhos/SP. Tenho a marca **Sapienza, Tecnologia Educacional** (kits educacionais em corte a laser, robótica e software). Este repositório é o **site da Sapienza**. A primeira funcionalidade é o **editor de carimbos personalizados** (`carimbos/index.html`), que vende kits de 2, 4 ou 6 carimbos com caixa de MDF. Leia `README.md` e `CLAUDE.md` antes de qualquer coisa.

## Estado atual
- `index.html`: home simples (logo, frase "Aprender com as mãos.", cartões: Carimbos ativo; Matemática em MDF, Robótica e Para escolas como "em breve").
- `carimbos/index.html`: editor completo em arquivo único, já corrigido para iPhone e navegador antigo (doctype, charset, viewport, botões sem `aspect-ratio`, cliques sem depender de `closest()`).
- Pedido: gera o código `SAP1:` (base64 de JSON `{k,s,c,b,u}`) e abre o WhatsApp com resumo. Nada vai para servidor.
- Constantes no editor: `ZAP` (WhatsApp), `PRECOS` (aberta: 79/139/189; estojo: 89/154/209).
- Não há build nem dependências. Fontes vêm do Google Fonts.

## O que quero fazer agora (nesta ordem)
1. **Subir no GitHub e ativar o Pages** (branch `main`, raiz). Me guie nos comandos: `git init`, primeiro commit, criar o repositório (`gh repo create` se disponível), push, e ativar Pages. Depois confirme que `/` e `/carimbos/` abrem.
2. **Revisar a compatibilidade** do editor em iPhone/Safari: reler o JS e o CSS procurando recursos que o Safari 12 a 14 não entende, e corrigir. Testar com Playwright em Chromium nas larguras 360 e 1280 clicando em todos os ícones e todas as opções.
3. **Melhorar a home**: adicionar a seção "Como funciona" (3 passos: monte, envie no WhatsApp, receba) e um botão fixo de WhatsApp. Sem inventar depoimentos nem números.
4. **Acessibilidade**: foco visível, contraste, alvos de toque de 44 px, `aria-pressed` nos botões de opção, textos alternativos.
5. **SEO básico**: `<title>` e `description` por página, `og:title`, `og:image` (criar imagem 1200x630 com o logo), `sitemap.xml`, `robots.txt`.
6. **Domínio próprio** (quando eu escolher): arquivo `CNAME` e ajuste do DNS, mantendo os caminhos relativos.
7. **Próximas páginas**: `matematica/` (kits de frações, tangram e pentaminós em MDF) e `escolas/` (pedido de orçamento por WhatsApp). Só depois que eu passar preços e fotos.

## Regras que não podem quebrar
- Tudo em português do Brasil (textos, docs, commits). Código em inglês.
- Sem servidor, login, banco ou rastreamento sem eu aprovar. Preços, prazo e frete são meus: pergunte, não invente.
- Nada de rosto, nome ou voz de aluno; não usar nome de escola, SEDUC ou SESI como endosso.
- Não mudar o formato `SAP1:` sem avisar: o projeto da minha laser (Sapienza LaserLink) lê esse código para gerar o arquivo de corte.
- Identidade: amarelo #F2B400, vermelho #E63A2E, preto #1B1B1B, branco #FFFFFF, creme #F2EFE8, fonte Poppins. Símbolo em `assets/`, sem distorcer.
- Commits curtos, em português, no imperativo. Antes de entregar, teste em largura de celular e de PC.

## Contexto de negócio (para decisões)
Dois públicos que não se misturam: (a) escolas e professores (BNCC, orçamento, kit demonstrativo); (b) venda direta (pais, presentes, feiras). O WhatsApp é o canal de venda no começo. Outros produtos da Sapienza: kits de matemática em MDF, organizador de mesa em MDF, robôs educativos, kits 3D em MDF.
