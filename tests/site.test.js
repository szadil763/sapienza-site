/* Testes do site Sapienza (Playwright + Chromium).
   Rodar na raiz do repositório:  node tests/site.test.js
   Precisa do Playwright instalado (npm i -g playwright && npx playwright install chromium).
   Sobe um servidor estático próprio, então não depende de python nem de build. */
var http = require('http');
var fs = require('fs');
var path = require('path');
var chromium;
try { chromium = require('playwright').chromium; }
catch (e) { console.error('Playwright não encontrado. Instale com: npm i -g playwright && npx playwright install chromium'); process.exit(2); }

var ROOT = path.resolve(__dirname, '..');
var TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
var ZAP = 'https://wa.me/5511953592189';

function servidor() {
  return http.createServer(function (req, res) {
    var p = decodeURIComponent(req.url.split('?')[0]);
    if (p.slice(-1) === '/') p += 'index.html';
    var f = path.join(ROOT, p);
    if (f.indexOf(ROOT) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
}

var falhas = 0;
function confere(ok, msg) { if (!ok) { falhas++; console.log('  FALHA: ' + msg); } }
function decodifica(cod) { return JSON.parse(Buffer.from(cod.slice(5), 'base64').toString('utf8')); }
function codifica(o) { return 'SAP1:' + Buffer.from(JSON.stringify(o), 'utf8').toString('base64'); }
async function codigoAtual(p) { return (await p.textContent('#resumo')).split('Código: ')[1].trim(); }

async function semRolagemLateral(p, nome) {
  var ov = await p.evaluate(function () { return document.documentElement.scrollWidth - document.documentElement.clientWidth; });
  confere(ov <= 0, nome + ': rolagem horizontal de ' + ov + ' px');
}
async function alvosDeToque(p, sel, nome) {
  var peq = await p.evaluate(function (s) {
    return [].slice.call(document.querySelectorAll(s)).filter(function (e) { return e.offsetParent !== null || getComputedStyle(e).position === 'fixed'; })
      .map(function (e) { var r = e.getBoundingClientRect(); return [(e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30), Math.round(r.width), Math.round(r.height)]; })
      .filter(function (x) { return x[1] < 44 || x[2] < 44; });
  }, sel);
  confere(peq.length === 0, nome + ': alvos menores que 44 px ' + JSON.stringify(peq.slice(0, 5)));
}

async function testaHome(p, base) {
  await p.goto(base, { waitUntil: 'networkidle' });
  await semRolagemLateral(p, 'home');
  await alvosDeToque(p, 'a:not(p a),button', 'home');
  confere((await p.getAttribute('a.zap', 'href')).indexOf(ZAP) === 0, 'home: botão de WhatsApp com número errado');
}

async function testaVitrine(p, base) {
  await p.goto(base + 'carimbos/', { waitUntil: 'networkidle' });
  for (var n of [2, 4, 6]) {
    await p.click('#seletor button[data-n="' + n + '"]');
    confere(await p.getAttribute('#seletor button[data-n="' + n + '"]', 'aria-pressed') === 'true', 'vitrine: aria-pressed do kit ' + n);
    confere((await p.getAttribute('#img-caixa', 'src')).indexOf('kit' + n + '-') >= 0, 'vitrine: foto do kit ' + n);
    confere(await p.getAttribute('[data-monte]', 'href') === 'monte/?n=' + n, 'vitrine: link do editor para o kit ' + n);
    confere(await p.locator('#cena .st').count() === n, 'vitrine: animação com ' + n + ' carimbos');
  }
  var quebradas = await p.evaluate(function () { return [].slice.call(document.images).filter(function (i) { return !i.naturalWidth; }).length; });
  confere(quebradas === 0, 'vitrine: imagens quebradas');
  await semRolagemLateral(p, 'vitrine');
  await alvosDeToque(p, 'a:not(p a),button', 'vitrine');
  /* tabela de preços da vitrine precisa ser igual à do editor */
  var tabela = await p.evaluate(function () {
    return [].slice.call(document.querySelectorAll('.tabela tbody tr')).map(function (tr) {
      return [].slice.call(tr.querySelectorAll('td.v')).map(function (td) { return td.textContent.replace(/\D/g, ''); });
    });
  });
  /* escolher 4 na vitrine abre o editor com 4 carimbos */
  await p.click('#seletor button[data-n="4"]');
  await p.locator('[data-monte]').first().click();
  await p.waitForLoadState('networkidle');
  confere(/carimbos\/monte\/\?n=4$/.test(p.url()), 'vitrine → editor: URL ' + p.url());
  confere(await p.locator('.slot').count() === 4, 'vitrine → editor: editor não abriu com 4 carimbos');
  confere(await p.getAttribute('#kit button[data-n="4"]', 'aria-pressed') === 'true', 'vitrine → editor: kit 4 não marcado');
  var kits = [2, 4, 6], caixas = ['aberta', 'estojo'];
  for (var i = 0; i < 3; i++) for (var j = 0; j < 2; j++) {
    await p.click('#kit button[data-n="' + kits[i] + '"]');
    await p.click('#caixa button[data-v="' + caixas[j] + '"]');
    var valor = (await p.textContent('#valor')).split(',')[0].replace(/\D/g, '');
    confere(valor === tabela[i][j], 'preço do kit ' + kits[i] + ' ' + caixas[j] + ': vitrine R$ ' + tabela[i][j] + ', editor R$ ' + valor);
  }
}

async function testaEditor(p, base) {
  await p.goto(base + 'carimbos/monte/', { waitUntil: 'networkidle' });
  for (var n of [2, 4, 6]) {
    await p.click('#kit button[data-n="' + n + '"]');
    confere(await p.locator('.slot').count() === n, 'editor: kit ' + n + ' com ' + n + ' miniaturas');
  }
  var ns = await p.locator('.slot').count();
  for (var i = 0; i < ns; i++) await p.locator('.slot').nth(i).click();
  await p.locator('.slot').nth(0).click();
  var ng = await p.locator('#grupos button').count();
  for (var g = 0; g < ng; g++) {
    await p.locator('#grupos button').nth(g).click();
    var ni = await p.locator('#icones .ic').count();
    for (var k = 0; k < ni; k++) {
      await p.locator('#icones .ic').nth(k).click();
      confere(await p.locator('#icones .ic').nth(k).getAttribute('aria-pressed') === 'true', 'editor: ícone ' + g + '/' + k + ' sem aria-pressed');
    }
  }
  for (var sel of ['#lado button', '#moldura button', '#caixa button', '.fonte']) {
    var nb = await p.locator(sel).count();
    for (var b = 0; b < nb; b++) await p.locator(sel).nth(b).click();
  }
  var nc = await p.locator('#cats button').count();
  for (var c = 0; c < nc; c++) {
    await p.locator('#cats button').nth(c).click();
    var nf = await p.locator('#frases .frase').count();
    for (var f = 0; f < nf; f++) await p.locator('#frases .frase').nth(f).click();
  }
  await semRolagemLateral(p, 'editor');
  await alvosDeToque(p, '.wrap a,.wrap button,summary,label.chk', 'editor');
}

/* contrato com o LaserLink: SAP1 = base64 de {k,s,c,b,u}; cada carimbo [t1,t2,fonte,ícone,lado,moldura].
   SAP2 = mesmo formato, usado só quando algum carimbo tem linha 3, que vai no 7º elemento */
async function testaCodigo(p, base) {
  await p.goto(base + 'carimbos/monte/', { waitUntil: 'networkidle' });
  var cod0 = await codigoAtual(p);
  confere(cod0.indexOf('SAP1:') === 0, 'sem linha 3 o código deve começar com SAP1:');
  var o = decodifica(cod0);
  confere(Object.keys(o).join() === 'k,s,c,b,u', 'SAP1: chaves ' + Object.keys(o).join());
  confere(o.k === 6 && o.s.length === 6, 'SAP1: kit padrão deveria ter 6 carimbos');
  confere(o.s.every(function (a) { return a.length === 6; }), 'SAP1: sem linha 3 cada carimbo deve ter 6 elementos');
  confere(JSON.stringify(o.s[0]) === JSON.stringify(['Prof.ª Ana', '', 'Fredoka', 'estrela', 'esq', 1]), 'SAP1: ordem dos campos ' + JSON.stringify(o.s[0]));

  await p.fill('#t1', 'Parabéns'); await p.fill('#t2', 'pelo seu'); await p.fill('#t3', 'capricho!');
  await p.fill('#cliente', 'Prof.ª Ana'); await p.fill('#cidade', 'Guarulhos');
  await p.click('#caixa button[data-v="estojo"]');
  var res = await p.textContent('#resumo');
  confere(res.indexOf('"Parabéns / pelo seu / capricho!"') >= 0, 'resumo sem as 3 linhas');
  confere(await p.locator('#prev text').count() === 3, 'prévia sem as 3 linhas');
  var cod = await codigoAtual(p);
  confere(cod.indexOf('SAP2:') === 0, 'com linha 3 o código deve começar com SAP2:');
  o = decodifica(cod);
  confere(o.s[0].length === 7 && o.s[0][6] === 'capricho!', 'SAP1: linha 3 no 7º elemento ' + JSON.stringify(o.s[0]));
  confere(o.s[1].length === 6, 'SAP1: carimbo sem linha 3 deve continuar com 6 elementos');
  confere(o.c === 'Prof.ª Ana' && o.b === 'estojo' && o.u === 'Guarulhos', 'SAP1: c/b/u ' + JSON.stringify([o.c, o.b, o.u]));
  confere((await p.getAttribute('#zap', 'href')).indexOf(ZAP + '?text=') === 0, 'link do WhatsApp');

  /* ida e volta: carregar o código reproduz o mesmo pedido */
  await p.click('#kit button[data-n="2"]');
  await p.click('summary');
  await p.fill('#cod', cod); await p.click('#carregar');
  confere(await p.textContent('#okc') === 'Pedido carregado.', 'carregar código válido');
  confere(await p.textContent('#resumo') === res, 'ida e volta do código mudou o resumo');
  confere(await p.inputValue('#t3') === 'capricho!', 'carregar não trouxe a linha 3');
  /* apagar a linha 3 volta para SAP1 */
  await p.fill('#t3', '');
  confere((await codigoAtual(p)).indexOf('SAP1:') === 0, 'sem linha 3 o código deve voltar a SAP1:');
  await p.fill('#t3', 'capricho!');
  confere(await p.textContent('#resumo') === res, 'recolocar a linha 3 mudou o resumo');
  /* códigos SAP1 antigos continuam carregando */
  await p.fill('#cod', cod0); await p.click('#carregar');
  confere(await p.textContent('#okc') === 'Pedido carregado.', 'código SAP1 antigo não carregou');
  await p.fill('#cod', cod); await p.click('#carregar');

  /* códigos incompletos ou adulterados são recusados e não mudam o pedido */
  var base6 = decodifica(cod);
  function copia() { return JSON.parse(JSON.stringify(base6)); }
  var ruins = {
    'menos carimbos que o kit': (function () { var x = copia(); x.s = x.s.slice(0, 4); return x; })(),
    'mais carimbos que o kit': (function () { var x = copia(); x.s.push(x.s[0]); return x; })(),
    'fonte fora da lista': (function () { var x = copia(); x.s[0][2] = 'Comic Sans'; return x; })(),
    'fonte com aspas': (function () { var x = copia(); x.s[0][2] = 'x" onmouseover="alert(1)'; return x; })(),
    'carimbo que não é lista': (function () { var x = copia(); x.s[0] = 'Parabéns'; return x; })(),
    'kit inexistente': (function () { var x = copia(); x.k = 3; x.s = x.s.slice(0, 3); return x; })()
  };
  for (var nome in ruins) {
    await p.fill('#cod', codifica(ruins[nome])); await p.click('#carregar');
    confere((await p.textContent('#okc')).indexOf('Código inválido') === 0, 'código com ' + nome + ' foi aceito');
    confere(await p.textContent('#resumo') === res, 'código com ' + nome + ' alterou o pedido');
  }
  await p.fill('#cod', 'SAP3:' + cod.slice(5)); await p.click('#carregar');
  confere((await p.textContent('#okc')).indexOf('Código inválido') === 0, 'prefixo desconhecido foi aceito');
  await p.fill('#cod', 'SAP1:isso-nao-e-base64'); await p.click('#carregar');
  confere((await p.textContent('#okc')).indexOf('Código inválido') === 0, 'código ilegível foi aceito');
}

(async function () {
  var srv = servidor();
  await new Promise(function (r) { srv.listen(0, '127.0.0.1', r); });
  var base = 'http://127.0.0.1:' + srv.address().port + '/';
  var nav = await chromium.launch();
  try {
    for (var w of [360, 1280]) {
      console.log('== largura ' + w);
      var ctx = await nav.newContext({ viewport: { width: w, height: 800 } });
      var p = await ctx.newPage();
      var erros = [];
      p.on('pageerror', function (e) { erros.push(e.message); });
      p.on('response', function (r) { if (r.status() >= 400 && r.url().indexOf(base) === 0) erros.push(r.status() + ' ' + r.url()); });
      await testaHome(p, base);
      await testaVitrine(p, base);
      await testaEditor(p, base);
      await testaCodigo(p, base);
      confere(erros.length === 0, 'erros na página: ' + erros.join(' | '));
      await ctx.close();
    }
  } finally {
    await nav.close();
    srv.close();
  }
  console.log(falhas ? falhas + ' falha(s)' : 'tudo ok');
  process.exit(falhas ? 1 : 0);
})();
