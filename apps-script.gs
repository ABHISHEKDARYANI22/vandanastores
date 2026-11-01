// Vandana Stores scratch app: shared storage for every phone and laptop.
// Paste this whole file into Extensions > Apps Script of a Google Sheet, then deploy it as a Web app.
const DEFAULT_PIN = '7755';

function P() { return PropertiesService.getScriptProperties(); }
function getCfg() { const s = P().getProperty('cfg'); return s ? JSON.parse(s) : null; }
function putCfg(c) { P().setProperty('cfg', JSON.stringify(c)); }
function pin() { return P().getProperty('pin') || DEFAULT_PIN; }

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Customers');
  if (!sh) {
    sh = ss.insertSheet('Customers');
    sh.appendRow(['Time', 'Name', 'Mobile', 'Gift', 'Code', 'Handed over', 'Coupon no']);
    sh.setFrozenRows(1);
  }
  return sh;
}
function phones() {
  const sh = sheet(); const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 3, n, 1).getDisplayValues().map(r => String(r[0]));
}

function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function doGet(e) { return json(run(e.parameter || {})); }
function doPost(e) { let b = {}; try { b = JSON.parse(e.postData.contents); } catch (x) {} return json(run(b)); }
function run(b) {
  const lock = LockService.getScriptLock(); lock.waitLock(25000);
  try { return handle(b); } catch (err) { return { ok: false, error: String(err) }; } finally { lock.releaseLock(); }
}

function handle(b) {
  const a = b.action; const cfg = getCfg();
  if (a === 'get') return { ok: true, cfg: cfg };
  if (a === 'login') return { ok: String(b.pin) === pin() };
  if (a === 'check') {
    const dup = !!(cfg && cfg.onePerPhone !== false && phones().indexOf(String(b.phone)) >= 0);
    return { ok: true, dup: dup, cfg: cfg };
  }
  if (a === 'play') {
    if (!cfg) return { ok: false, error: 'not_setup' };
    const phone = String(b.phone || '');
    if (cfg.onePerPhone !== false && phones().indexOf(phone) >= 0) return { ok: false, error: 'dup', cfg: cfg };
    if ((cfg.issued || 0) >= (cfg.totalCoupons || 0)) return { ok: false, error: 'over', cfg: cfg };
    const p = draw(cfg);
    cfg.issued = (cfg.issued || 0) + 1;
    if (p) p.given = (p.given || 0) + 1;
    putCfg(cfg);
    const code = p ? makeCode() : '';
    sheet().appendRow([new Date(), b.name || '', "'" + phone, p ? p.name : 'No prize', code, p ? 'No' : '', b.coupon || '']);
    return { ok: true, prizeId: p ? p.id : null, prize: p ? p.name : null, code: code, cfg: cfg };
  }

  // everything below needs the owner PIN
  if (String(b.pin) !== pin()) return { ok: false, error: 'Wrong PIN' };
  if (a === 'saveCfg') {
    const c = b.cfg;
    if (!c || !c.prizes) return { ok: false, error: 'No settings sent' };
    if (cfg && !b.counts) { // keep the live counts unless the owner edited them
      c.issued = cfg.issued;
      const g = {}; (cfg.prizes || []).forEach(p => g[p.id] = p.given || 0);
      c.prizes.forEach(p => p.given = g[p.id] !== undefined ? g[p.id] : (p.given || 0));
    }
    putCfg(c);
    if (b.newPin) P().setProperty('pin', String(b.newPin));
    return { ok: true, cfg: c };
  }
  if (a === 'log') {
    const sh = sheet(); const n = sh.getLastRow() - 1;
    if (n < 1) return { ok: true, log: [] };
    const v = sh.getRange(2, 1, n, 6).getValues();
    return { ok: true, log: v.map((r, i) => ({
      row: i + 2, t: new Date(r[0]).getTime(), name: String(r[1]), phone: String(r[2]).replace(/^'/, ''),
      prize: r[3] === 'No prize' ? null : String(r[3]), code: String(r[4]), handed: r[5] === 'Yes'
    })).reverse() };
  }
  if (a === 'hand') { sheet().getRange(Number(b.row), 6).setValue(b.value ? 'Yes' : 'No'); return { ok: true }; }
  if (a === 'reset') { // keep the old list as its own tab, start a fresh one
    const sh = sheet();
    if (sh.getLastRow() > 1) sh.setName('Customers ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm'));
    sheet();
    if (cfg) { cfg.issued = 0; cfg.prizes.forEach(p => p.given = 0); putCfg(cfg); }
    return { ok: true, cfg: cfg };
  }
  return { ok: false, error: 'Unknown action' };
}

// with "adjust by stock" on, a gift's weight shrinks as its stock runs out
function liveWeight(cfg, p) {
  const w = +p.weight || 0;
  if (cfg.dynamicStock === false || !(p.qty > 0)) return w;
  return w * Math.max(0, p.qty - (p.given || 0)) / p.qty;
}
function draw(cfg) {
  const items = cfg.prizes.filter(p => p.weight > 0 && (p.qty <= 0 || (p.given || 0) < p.qty)).map(p => ({ p: p, w: liveWeight(cfg, p) }));
  if (cfg.loseWeight > 0) items.push({ p: null, w: +cfg.loseWeight });
  const total = items.reduce((s, i) => s + i.w, 0);
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const it of items) { if ((r -= it.w) < 0) return it.p; }
  return items[items.length - 1].p;
}
function makeCode() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = 'VS-';
  for (let i = 0; i < 5; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}
