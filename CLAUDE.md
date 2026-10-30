# CLAUDE.md, Sapienza site

Projeto do Adilson (Guarulhos/SP), marca **Sapienza, Tecnologia Educacional**. Idioma: **português do Brasil** em textos do site, docs e commits. Código e identificadores em inglês.

## Estrutura
Site estático (HTML, CSS e JS puros, sem framework e sem build). `index.html` é a home; cada produto é uma pasta (`carimbos/`, depois `matematica/` etc.). Caminhos sempre **relativos**.

## Regras
1. **Compatibilidade antes de tudo**: a clientela usa celular, inclusive iPhone e navegador interno do WhatsApp. Nada de sintaxe que o Safari antigo não entenda: sem `aspect-ratio` para dimensionar botões, sem `closest()` sem fallback, sem `?.`. Toda página começa com `<!doctype html>`, `<meta charset="utf-8">` e `<meta name="viewport">`. Alvo de toque mínimo de 44 px.
2. **Sem servidor e sem coleta de dados**: o pedido vai por WhatsApp. Não adicionar login, banco de dados, analytics ou formulários que enviem dados sem decisão explícita do Adilson (LGPD).
3. **Preços, prazo e frete vêm do Adilson.** Não inventar. Não inventar depoimentos, avaliações ou números.
4. **Alunos são menores**: nunca usar rosto, nome ou voz de aluno. Não usar nome ou uniforme de escola, SEDUC ou SESI como se fossem endosso da Sapienza.
5. **BNCC**: citar só códigos reais e verificados.
6. **Logo**: usar `assets/simbolo-*.svg` sem distorcer, recolorir ou aplicar efeito. Versão clara em fundo claro, escura em fundo escuro.
7. **Cores da marca** só as de `README.md`. Tom: professor que mostra a prática, claro, sem jargão de marketing.
8. O formato do código de pedido `SAP1:`/`SAP2:` é contrato com o projeto da laser (descrito no `README.md`). **Não mudar** sem atualizar o outro lado (veja `docs/HANDOFF.md`).

## Testar antes de entregar
- Rodar `node tests/site.test.js` (precisa do Playwright). Ao mudar o editor, o código `SAP1:` ou os preços, atualizar o teste junto.
- Abrir via `python3 -m http.server`, em largura de celular (390 px) e de PC.
- Clicar em todos os ícones, trocar de grupo, de letra e de quantidade de carimbos; conferir o resumo e o botão do WhatsApp.
- Se possível, testar em iPhone (Safari) e no navegador do WhatsApp.

## Commits
Curtos, em português, no imperativo. Ex.: `Adiciona página de matemática`.
