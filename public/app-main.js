
(function () {
'use strict';
var L = window.Lich, T = window.TuVi, TB = window.ThayBa, DOC = window.DOC;
var $ = function (s) { return document.querySelector(s); };
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function opts(sel, from, to, fmt, val) { var h = ''; for (var i = from; i <= to; i++) h += '<option value="' + i + '"' + (i === val ? ' selected' : '') + '>' + (fmt ? fmt(i) : i) + '</option>'; sel.innerHTML = h; }
function money(n) { return n.toLocaleString('vi-VN') + 'đ'; }
function ls_get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function ls_set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function isoDate(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function parseIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

/* ---------- Chế độ chạy ---------- */
var MODE = 'offline', CFG = null, sample = null;
var ready = (async function () {
  try {
    var r = await fetch('/api/cau-hinh', { headers: { accept: 'application/json' } });
    if (r.ok) { var j = await r.json(); if (j && j.ok) { CFG = j; MODE = 'server'; return; } }
  } catch (e) {}
  if (window.claude && typeof window.claude.use === 'function') {
    try { sample = await window.claude.use('sample'); if (sample) MODE = 'demo'; } catch (e) {}
  }
})();

/* ---------- Tabs ---------- */
var TAB_DS = ['hoi', 'nam', 'hop', 'lich', 'ngay'];
function moTab(tab) {
  if (TAB_DS.indexOf(tab) < 0) tab = 'hoi';
  document.querySelectorAll('nav.tabs button').forEach(function (x) { x.setAttribute('aria-selected', x.dataset.tab === tab ? 'true' : 'false'); });
  TAB_DS.forEach(function (t) { var el = $('#tab-' + t); if (el) el.classList.toggle('hidden', t !== tab); });
}
document.querySelectorAll('nav.tabs button').forEach(function (b) {
  b.addEventListener('click', function () { moTab(b.dataset.tab); window.scrollTo({ top: 0 }); });
});
try { var tabUrl = new URLSearchParams(location.search).get('tab'); if (tabUrl) moTab(tabUrl); } catch (e) {}


/* ---------- PWA: cài lên màn hình chính, chạy khi mất mạng ---------- */
var trongKhung = false; try { trongKhung = window.top !== window.self; } catch (e) { trongKhung = true; }
var daCai = (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) || (typeof navigator !== 'undefined' && navigator.standalone === true);
if ('serviceWorker' in navigator && !trongKhung && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
var loiMoiCai = null, btnCai = document.getElementById('btnCai');
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); loiMoiCai = e; if (!trongKhung) btnCai.classList.remove('hidden'); });
window.addEventListener('appinstalled', function () { btnCai.classList.add('hidden'); loiMoiCai = null; });
var laIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (laIOS && !daCai && !trongKhung) btnCai.classList.remove('hidden');
btnCai.addEventListener('click', async function () {
  if (loiMoiCai) { loiMoiCai.prompt(); try { await loiMoiCai.userChoice; } catch (e) {} loiMoiCai = null; btnCai.classList.add('hidden'); return; }
  var sh = document.getElementById('sheet');
  document.getElementById('sheetIn').innerHTML = '<div class="sheet-grab" aria-hidden="true"></div><div class="sheet-head"><h3 id="sheetTitle">Cài XemBoi.vn lên điện thoại</h3>' +
    '<button class="icon-btn" type="button" id="sheetClose" aria-label="Đóng"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<ol style="padding-left:20px;line-height:1.8;margin:14px 0 0"><li>Mở trang này bằng <b>Safari</b>.</li><li>Bấm nút <b>Chia sẻ</b> (ô vuông có mũi tên lên) ở thanh dưới.</li><li>Chọn <b>Thêm vào MH chính</b>, rồi bấm <b>Thêm</b>.</li></ol>' +
    '<p class="small muted">Sau đó XemBoi.vn có biểu tượng riêng trên màn hình, mở lên toàn màn hình như ứng dụng. Lịch âm và xem ngày dùng được cả khi không có mạng.</p>';
  if (sh.showModal) sh.showModal(); else sh.setAttribute('open', '');
  document.getElementById('sheetClose').addEventListener('click', function () { sh.close(); });
});
function startApp() {
  L = window.Lich;
  T = window.TuVi;
  TB = window.ThayBa;
  if (!L || !T || !TB || !window.HomNay || !window.TronDoi) {
    setTimeout(startApp, 30);
    return;
  }
var now = new Date();
var amNow = { ngay: 1, thang: 1, nam: 2026 };
var CHI_CONST = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
var GIO_CONST = ['23h–1h', '1h–3h', '3h–5h', '5h–7h', '7h–9h', '9h–11h', '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'];

function capNhatLichVaTopics() {
  L = window.Lich || L;
  T = window.TuVi || T;
  TB = window.ThayBa || TB;
  if (!L || !TB) {
    setTimeout(capNhatLichVaTopics, 50);
    return;
  }
  amNow = L.duongSangAm(now.getDate(), now.getMonth() + 1, now.getFullYear());
  var lbl = $('#todayLabel');
  if (lbl) lbl.textContent = 'Âm ' + amNow.ngay + '/' + amNow.thang + ' ' + L.ten(L.canChiNam(amNow.nam));

  var cvNgay = $('#cvAmNgay'), cvThang = $('#cvAmThang'), cvNam = $('#cvAmNam');
  if (cvNgay) opts(cvNgay, 1, 30, null, amNow.ngay);
  if (cvThang) opts(cvThang, 1, 12, null, amNow.thang);
  if (cvNam) cvNam.value = amNow.nam;

  var topicsEl = $('#topics');
  if (topicsEl && TB.CHU_DE) {
    topicsEl.innerHTML = Object.keys(TB.CHU_DE).map(function (k) {
      return '<button class="chip" type="button" data-k="' + k + '" aria-pressed="' + (k === chuDe) + '">' + esc(TB.CHU_DE[k].ten) + '</button>';
    }).join('');
  }
  var fGio = $('#fGio');
  if (fGio && L.CHI && L.GIO_KHOANG) {
    fGio.innerHTML = L.CHI.map(function (c, i) { return '<option value="' + i + '"' + (i === 6 ? ' selected' : '') + '>Giờ ' + c + ' (' + L.GIO_KHOANG[i] + ')</option>'; }).join('');
  }
}
capNhatLichVaTopics();

/* ---------- Danh Sư AI ---------- */
var bubble = $('#bubble');
function say(t) { if (bubble) bubble.textContent = t; }
var POKES = ['Khụ khụ… thầy chưa ngủ đâu. Hỏi gì cứ hỏi.', 'Đừng giật râu thầy chứ con!', 'Trời có lúc nắng lúc mưa, người có lúc thịnh lúc suy.', 'Thầy ngồi chợ này bốn chục năm rồi đấy.', 'Đức năng thắng số, con nhớ lấy.'];
var pokeN = 0;
var scene = $('#scene');
if (scene) scene.addEventListener('click', function () { say(POKES[pokeN++ % POKES.length]); });

var chuDe = 'tongquan';
var topicsEl = $('#topics');
if (topicsEl) {
  topicsEl.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    chuDe = b.dataset.k;
    topicsEl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    if (window.ThayBa && window.ThayBa.CHU_DE && window.ThayBa.CHU_DE[chuDe]) say(window.ThayBa.CHU_DE[chuDe].loi);
    if (laSo) { lapLuan(); } else { var bf = $('#birthForm'); if (bf) bf.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
}

/* ---------- Form ngày sinh ---------- */
var gender = 'nam', calType = 'duong';
function seg(id, cb) {
  var el = $(id);
  if (!el) return;
  el.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    el.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    cb(b.dataset.v);
  });
}
seg('#segGender', function (v) { gender = v; });
seg('#segCal', function (v) { calType = v; var lw = $('#leapWrap'); if (lw) lw.classList.toggle('hidden', v !== 'am'); var fn = $('#fNgay'); if (fn) opts(fn, 1, v === 'am' ? 30 : 31, null, +fn.value || 1); });
var fNgay = $('#fNgay'); if (fNgay) opts(fNgay, 1, 31, null, 1);
var fThang = $('#fThang'); if (fThang) opts(fThang, 1, 12, null, 1);
var fGio = $('#fGio');
if (fGio) {
  var chiList = (L && L.CHI) || CHI_CONST;
  var gioList = (L && L.GIO_KHOANG) || GIO_CONST;
  fGio.innerHTML = chiList.map(function (c, i) { return '<option value="' + i + '"' + (i === 6 ? ' selected' : '') + '>Giờ ' + c + ' (' + gioList[i] + ')</option>'; }).join('');
}

var laSo = null, sinh = null;
var curLaSo = null, curInfo = null;
window.tuviDisplayOpts = window.tuviDisplayOpts || { phuTinh: true, saoLuu: true, tamHop: false, phaiTuHoa: 'nam_phai' };
var tuviDisplayOpts = window.tuviDisplayOpts;
var hcChon = {};
document.querySelectorAll('#hcBox .hc-nhom').forEach(function (nhom) {
  nhom.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = nhom.dataset.k, bat = b.getAttribute('aria-pressed') !== 'true';
    nhom.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b && bat ? 'true' : 'false'); });
    if (bat) hcChon[k] = b.dataset.v; else delete hcChon[k];
  });
});
function layHoanCanh() {
  var h = {}; Object.keys(hcChon).forEach(function (k) { h[k] = hcChon[k]; });
  var bk = $('#fBk').value.trim().slice(0, 150); if (bk) h.bk = bk;
  return Object.keys(h).length ? h : null;
}
function datHoanCanh(h) {
  h = h || {}; hcChon = {};
  document.querySelectorAll('#hcBox .hc-nhom').forEach(function (nhom) {
    var v = h[nhom.dataset.k]; if (v) hcChon[nhom.dataset.k] = v;
    nhom.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.v === v ? 'true' : 'false'); });
  });
  $('#fBk').value = h.bk || '';
}
/** Lập lá số từ ngày sinh, gắn kèm hoàn cảnh người xem kể */
function lapTuSinh(s) { var l = T.anLaSo(s); if (s.hoanCanh) l.hoanCanh = s.hoanCanh; return l; }
$('#birthForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (window.DOC && typeof window.DOC.dung === 'function') window.DOC.dung();
  $('#docHanhDong').classList.add('hidden');
  var f = e.target, err = $('#formErr'); err.textContent = '';
  var nam = parseInt(f.nam.value, 10), ngay = +f.ngay.value, thang = +f.thang.value;
  if (!(nam >= 1900 && nam <= 2100)) { err.textContent = 'Năm sinh cần trong khoảng 1900–2100.'; f.nam.focus(); return; }
  if (calType === 'duong') {
    var d = new Date(nam, thang - 1, ngay);
    if (d.getMonth() !== thang - 1) { err.textContent = 'Ngày dương lịch này không có (tháng ' + thang + ' không có ngày ' + ngay + ').'; return; }
  } else if (!L.amSangDuong(ngay, thang, nam, f.nhuan.checked)) {
    var nh = L.thangNhuan(nam);
    err.textContent = f.nhuan.checked ? ('Năm ' + nam + (nh ? ' chỉ nhuận tháng ' + nh : ' không có tháng nhuận') + '.') : 'Tháng âm này không có ngày ' + ngay + '.';
    return;
  }
  sinh = { lich: calType, ngay: ngay, thang: thang, nam: nam, nhuan: calType === 'am' && f.nhuan.checked, gio: +f.gio.value * 2, gioiTinh: gender, ten: f.ten.value.trim().slice(0, 60), phaiTuHoa: (typeof window !== 'undefined' && window.tuviDisplayOpts && window.tuviDisplayOpts.phaiTuHoa) ? window.tuviDisplayOpts.phaiTuHoa : 'nam_phai' };
  var hcNay = layHoanCanh(); if (hcNay) sinh.hoanCanh = hcNay;
  laSo = lapTuSinh(sinh);
  try {
    localStorage.setItem('xb_cur_laso', JSON.stringify(laSo));
    var vid = localStorage.getItem('xb_vid') || ('xb_v_' + Date.now().toString(36));
    localStorage.setItem('xb_vid', vid);
    fetch('/api/tracking/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: vid,
        eventType: 'GENERATE_CHART',
        path: window.location.pathname,
        metadata: {
          fullName: laSo.ten,
          gender: laSo.gioiTinh,
          solarBirthDate: laSo.duong ? (laSo.duong.nam + '-' + String(laSo.duong.thang).padStart(2,'0') + '-' + String(laSo.duong.ngay).padStart(2,'0')) : undefined,
          canChiYear: laSo.canChi ? laSo.canChi.nam : undefined,
          banMenh: laSo.banMenh,
          cucName: laSo.cuc,
        }
      })
    }).catch(function(){});
  } catch(e) {}
  ls_set('chotuvi_sinh', { sinh: sinh, chuDe: chuDe });
  SO_LA_SO.luu(sinh); veThang(laSo); veHomNay();
  $('#result').classList.remove('hidden');
  veLaSo(laSo);
  try {
    window.dispatchEvent(new CustomEvent('xb_chart_generated', { detail: { chart: laSo } }));
  } catch(e) {}
  resetPay();
  lapLuan().then(moLaiDonCu);
  HOI.moi();
});

/* ---------- Hình nền lá số: 12 con giáp và bát quái (XemBoi.vn tự vẽ) ---------- */
var GIAP_HINH = ["<ellipse cx=\"46\" cy=\"64\" rx=\"27\" ry=\"16\"/><circle cx=\"72\" cy=\"55\" r=\"12\"/><circle cx=\"68\" cy=\"41\" r=\"8\"/><circle cx=\"81\" cy=\"44\" r=\"6.5\"/><path d=\"M84 58 L93 61 L84 63 Z\"/><path d=\"M20 66 Q4 72 9 86 Q14 95 30 90\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3.5\"/><rect x=\"34\" y=\"76\" width=\"5\" height=\"9\" rx=\"2\"/><rect x=\"55\" y=\"76\" width=\"5\" height=\"9\" rx=\"2\"/>", "<rect x=\"18\" y=\"42\" width=\"56\" height=\"30\" rx=\"13\"/><rect x=\"23\" y=\"66\" width=\"8\" height=\"20\" rx=\"3\"/><rect x=\"38\" y=\"66\" width=\"8\" height=\"20\" rx=\"3\"/><rect x=\"55\" y=\"66\" width=\"8\" height=\"20\" rx=\"3\"/><ellipse cx=\"80\" cy=\"50\" rx=\"13\" ry=\"11\"/><ellipse cx=\"86\" cy=\"57\" rx=\"8\" ry=\"6\"/><path d=\"M72 41 Q63 26 76 22 M89 41 Q99 28 88 22\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/><path d=\"M18 52 Q8 58 11 72\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\"/>", "<path d=\"M14 58 Q16 40 40 40 L66 40 Q72 40 74 46 L74 70 L66 70 L66 86 L58 86 L58 70 L30 70 L30 86 L22 86 L22 70 Q14 68 14 58 Z\"/><circle cx=\"78\" cy=\"42\" r=\"13\"/><path d=\"M68 32 L70 22 L77 30 Z M84 30 L91 22 L91 34 Z\"/><path d=\"M15 54 Q2 46 6 32 Q8 26 14 28\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4\"/><path d=\"M36 42 L40 54 M48 42 L51 56 M60 42 L62 54\" stroke=\"var(--soc, #fff)\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/>", "<path d=\"M30 88 Q24 60 40 46 L60 46 Q72 60 68 88 Z\"/><circle cx=\"50\" cy=\"34\" r=\"16\"/><path d=\"M36 26 L36 10 L48 20 Z M64 26 L64 10 L52 20 Z\"/><path d=\"M68 84 Q90 84 86 66 Q84 58 78 60\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>", "<path d=\"M12 70 Q24 50 38 64 Q52 78 62 58 Q70 42 84 46\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"11\"/><path d=\"M80 36 Q94 34 96 46 Q94 54 82 54 Z\"/><path d=\"M82 38 L78 24 M88 37 L92 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\"/><path d=\"M94 48 Q99 58 92 64\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"/><path d=\"M30 58 L28 48 M46 72 L50 62 M60 56 L56 48\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4\"/><path d=\"M12 70 Q6 74 8 82\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"6\"/>", "<path d=\"M14 84 Q30 92 46 84 Q62 76 46 66 Q30 58 46 50 Q62 42 54 30 Q50 22 60 18\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"10\"/><ellipse cx=\"66\" cy=\"17\" rx=\"10\" ry=\"7\"/><path d=\"M75 18 L84 15 M75 18 L84 21\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"/>", "<path d=\"M30 90 L32 64 Q30 46 42 34 Q46 22 58 14 L60 22 Q72 20 80 32 Q86 40 82 46 Q76 48 70 42 Q66 52 66 62 L70 90 Z\"/><path d=\"M42 34 Q34 30 30 40 Q28 50 32 58\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>", "<rect x=\"20\" y=\"44\" width=\"50\" height=\"26\" rx=\"12\"/><rect x=\"25\" y=\"64\" width=\"7\" height=\"22\" rx=\"3\"/><rect x=\"58\" y=\"64\" width=\"7\" height=\"22\" rx=\"3\"/><path d=\"M68 48 L76 30 Q84 28 88 36 L86 50 Q80 56 72 54 Z\"/><path d=\"M76 32 Q70 18 82 16 Q92 18 86 28\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4\"/><path d=\"M84 52 L86 64\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4\"/><path d=\"M20 50 L12 44\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4\"/>", "<circle cx=\"50\" cy=\"28\" r=\"15\"/><circle cx=\"33\" cy=\"28\" r=\"6\"/><circle cx=\"67\" cy=\"28\" r=\"6\"/><path d=\"M36 86 Q32 56 50 46 Q68 56 64 86 Z\"/><path d=\"M64 80 Q86 84 88 64 Q90 48 78 46\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4\"/><path d=\"M38 56 Q26 64 30 76 M62 56 Q72 62 70 72\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>", "<path d=\"M24 56 Q24 80 50 82 Q72 82 76 62 L76 40 Q76 28 66 28 Q56 28 56 40 L56 52 Z\"/><path d=\"M60 26 Q60 14 66 20 Q68 12 72 20 Q76 14 76 26 Z\"/><path d=\"M76 38 L86 41 L76 44 Z\"/><path d=\"M70 46 Q72 54 66 52\" fill=\"currentColor\"/><path d=\"M28 58 Q10 46 14 26 M30 62 Q8 60 6 42 M32 66 Q14 72 8 60\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4\"/><path d=\"M44 82 L42 92 M56 82 L58 92\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\"/>", "<path d=\"M28 88 Q26 62 40 52 L58 52 Q68 62 66 88 Z\"/><circle cx=\"56\" cy=\"38\" r=\"15\"/><path d=\"M66 36 L84 40 Q86 48 74 48 L66 46 Z\"/><path d=\"M44 30 Q36 34 38 50 Q46 46 48 36 Z\"/><path d=\"M28 80 Q12 78 14 62\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\"/>", "<ellipse cx=\"46\" cy=\"58\" rx=\"32\" ry=\"22\"/><ellipse cx=\"80\" cy=\"56\" rx=\"9\" ry=\"10\"/><path d=\"M66 38 L74 28 L76 42 Z\"/><rect x=\"26\" y=\"74\" width=\"9\" height=\"14\" rx=\"3\"/><rect x=\"56\" y=\"74\" width=\"9\" height=\"14\" rx=\"3\"/><path d=\"M14 54 Q6 50 9 44 Q12 40 15 46\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\"/>"];
/** Vòng bát quái (tiên thiên) quanh âm dương, viewBox -100 -100 200 200 */
function batQuaiSvg() {
  var QUE = [[1, 1, 1], [0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0], [1, 0, 0], [1, 0, 1], [1, 1, 0]]; // hào từ trong ra ngoài
  var h = '<circle r="96" fill="none" stroke="currentColor" stroke-width="2"/><circle r="90" fill="none" stroke="currentColor" stroke-width="0.8"/><circle r="44" fill="none" stroke="currentColor" stroke-width="1.5"/>';
  for (var t = 0; t < 72; t++) { var a = t * 5 * Math.PI / 180, r1 = t % 9 === 0 ? 84 : 87; h += '<line x1="' + (Math.sin(a) * r1).toFixed(1) + '" y1="' + (-Math.cos(a) * r1).toFixed(1) + '" x2="' + (Math.sin(a) * 90).toFixed(1) + '" y2="' + (-Math.cos(a) * 90).toFixed(1) + '" stroke="currentColor" stroke-width="0.8"/>'; }
  QUE.forEach(function (q, i) {
    var g = '';
    q.forEach(function (hao, k) {
      var y = -(52 + k * 9);
      g += hao ? '<rect x="-15" y="' + y + '" width="30" height="5" rx="1"/>' : '<rect x="-15" y="' + y + '" width="12.5" height="5" rx="1"/><rect x="2.5" y="' + y + '" width="12.5" height="5" rx="1"/>';
    });
    h += '<g transform="rotate(' + (i * 45) + ')">' + g + '</g>';
  });
  h += '<path d="M0 -36 A36 36 0 0 1 0 36 A18 18 0 0 1 0 0 A18 18 0 0 0 0 -36 Z"/><circle r="36" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cy="-18" r="5"/><circle cy="18" r="5" fill="var(--bq-nen, #f3e6c8)"/><circle cy="18" r="5" fill="none" stroke="currentColor" stroke-width="1"/>';
  return '<svg viewBox="-100 -100 200 200" fill="currentColor">' + h + '</svg>';
}
/** Ảnh từ SVG để vẽ lên canvas (ảnh lá số tải về) */
function anhSvg(than, vb, mau, nen) {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="400" height="400" fill="' + mau + '" color="' + mau + '" style="--soc:' + nen + ';--bq-nen:' + nen + '">' + than + '</svg>';
  return new Promise(function (ok) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
}

/* ---------- Vẽ lá số ---------- */
var POS = { 5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4], 9: [2, 4], 10: [3, 4], 11: [4, 4], 0: [4, 3], 1: [4, 2], 2: [4, 1], 3: [3, 1], 4: [2, 1] };
var HANH_CLS = { 'Kim': 'h-kim', 'Mộc': 'h-moc', 'Thủy': 'h-thuy', 'Hỏa': 'h-hoa', 'Thổ': 'h-tho' };

function hoaTag(s) { return s.hoa ? '<span class="hoa">' + esc(s.hoa.replace('Hóa ', '')) + '</span>' : ''; }
function dtTag(s) { return s.dacTinh ? '<span class="dt">' + esc(s.dacTinh) + '</span>' : ''; }
function saoNho(s, i, max) { return '<span class="' + HANH_CLS[s.hanh] + (i >= max ? ' x' : '') + '">' + esc(s.ten) + dtTag(s) + '</span>'; }
function cot(ds, cls) {
  var MAX_MOBI = 3;
  var h = ds.map(function (s, i) { return saoNho(s, i, MAX_MOBI); }).join('');
  if (ds.length > MAX_MOBI) h += '<span class="p-more mobi-more">+' + (ds.length - MAX_MOBI) + '</span>';
  return '<span class="' + cls + '">' + h + '</span>';
}

function veDuongTamHop(ls) {
  if (!ls || !ls.cung || !ls.cung.length) return '';
  try {
    var getCenter = function (chi) {
      var p = POS[chi];
      if (!p) return [50, 50];
      return [(p[1] - 0.5) * 25, (p[0] - 0.5) * 25];
    };
    var menh = null, tai = null, quan = null, di = null;
    for (var i = 0; i < ls.cung.length; i++) {
      var c = ls.cung[i];
      if (c.ten === 'Mệnh') menh = c;
      else if (c.ten === 'Tài Bạch') tai = c;
      else if (c.ten === 'Quan Lộc') quan = c;
      else if (c.ten === 'Thiên Di') di = c;
    }
    var menhChi = menh ? menh.chi : 2;
    var taiChi = tai ? tai.chi : ((menhChi + 8) % 12);
    var quanChi = quan ? quan.chi : ((menhChi + 4) % 12);
    var diChi = di ? di.chi : ((menhChi + 6) % 12);

    var m = getCenter(menhChi);
    var t = getCenter(taiChi);
    var q = getCenter(quanChi);
    var d = getCenter(diChi);

    return '<svg class="tam-hop-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<polygon points="' + m[0].toFixed(1) + ',' + m[1].toFixed(1) + ' ' + t[0].toFixed(1) + ',' + t[1].toFixed(1) + ' ' + q[0].toFixed(1) + ',' + q[1].toFixed(1) + '" class="th-tamgiac" />' +
      '<line x1="' + m[0].toFixed(1) + '" y1="' + m[1].toFixed(1) + '" x2="' + d[0].toFixed(1) + '" y2="' + d[1].toFixed(1) + '" class="th-xungchieu" />' +
      '<circle cx="' + m[0].toFixed(1) + '" cy="' + m[1].toFixed(1) + '" r="1.5" class="th-dot" />' +
      '<circle cx="' + t[0].toFixed(1) + '" cy="' + t[1].toFixed(1) + '" r="1.5" class="th-dot" />' +
      '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="1.5" class="th-dot" />' +
      '<circle cx="' + d[0].toFixed(1) + '" cy="' + d[1].toFixed(1) + '" r="1.5" class="th-dot" />' +
      '</svg>';
  } catch (e) {
    return '';
  }
}

function veLaSo(ls) {
  if (!ls) return;
  try {
    curLaSo = ls;
    window.curLaSo = ls;
    window.veLaSo = veLaSo;
    if (sinh) { curInfo = sinh; window.curInfo = sinh; }

    var h = '';
    ls.cung.forEach(function (c) {
      var p = POS[c.chi];
      var clsExtra = c.ten === 'Mệnh' ? ' menh' : '';
      var cat = c.catTinh.filter(function (s) { return !/^Hóa /.test(s.ten); }),
          hung = c.hungTinh.filter(function (s) { return s.ten !== 'Hóa Kỵ'; });

      var tags = (c.laThan ? '<span class="tag">THÂN</span>' : '') + (c.tuan ? '<span class="tag tt">TUẦN</span>' : '') + (c.triet ? '<span class="tag tt">TRIỆT</span>' : '');

      h += '<button type="button" class="palace' + clsExtra + '" data-chi="' + c.chi + '" style="grid-row:' + p[0] + ';grid-column:' + p[1] + '" aria-label="Cung ' + esc(c.ten) + ' tại ' + esc(c.tenChi) + ', ' + esc(c.chinhTinh.length ? c.chinhTinh.map(function (s) { return s.ten; }).join(', ') : 'vô chính diệu') + '. Chạm để xem chi tiết">' +
        '<svg class="p-giap" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + GIAP_HINH[c.chi] + '</svg>' +
        '<span class="p-head"><span class="p-cc">' + esc(c.can.charAt(0) + '.' + c.tenChi) + '</span><span class="p-name">' + esc(c.ten) + '</span><span class="p-dh">' + c.daiVanTu + '</span></span>' +
        (tags ? '<span class="p-tags">' + tags + '</span>' : '') +
        '<span class="p-chinh">' + (c.chinhTinh.length ? c.chinhTinh.map(function (s) { return '<span class="' + HANH_CLS[s.hanh] + '">' + esc(s.ten) + dtTag(s) + '</span>' + hoaTag(s); }).join('<br>') : '<span class="vcd">Vô chính diệu</span>') + '</span>' +
        '<span class="p-cols">' + cot(cat, 'l') + cot(hung, 'r') + '</span>' +
        '<span class="p-foot"><span>' + esc(c.trangSinh) + '</span><span>' + esc(c.tieuHan) + '</span></span></button>';
    });

    h += '<div class="center"><div class="bq-xoay" aria-hidden="true">' + batQuaiSvg() + '</div><div class="t">' + esc(ls.ten || 'Lá số tử vi') + '</div><dl>' +
      '<dt>Dương lịch</dt><dd>' + ls.duong.ngay + '/' + ls.duong.thang + '/' + ls.duong.nam + '</dd>' +
      '<dt>Âm lịch</dt><dd>' + ls.am.ngay + '/' + ls.am.thang + (ls.am.nhuan ? 'n' : '') + ' ' + esc(ls.canChi.nam) + '</dd>' +
      '<dt>Giờ</dt><dd>' + esc(ls.gio.canChi) + '</dd>' +
      '<dt class="opt">Ngày/tháng</dt><dd class="opt">' + esc(ls.canChi.ngay + ' / ' + ls.canChi.thang) + '</dd>' +
      '<dt>Âm dương</dt><dd>' + esc(ls.amDuong) + '</dd>' +
      '<dt>Mệnh</dt><dd>' + esc(ls.banMenh) + '</dd>' +
      '<dt>Cục</dt><dd>' + esc(ls.cuc) + '</dd>' +
      '<dt class="opt"></dt><dd class="opt">' + esc(ls.sinhKhac + ' · ' + ls.amDuongLy) + '</dd>' +
      '<dt class="opt">Mệnh chủ</dt><dd class="opt">' + esc(ls.menhChu) + '</dd>' +
      '<dt class="opt">Thân chủ</dt><dd class="opt">' + esc(ls.thanChu) + '</dd>' +
      '<dt class="opt">Tuần / Triệt</dt><dd class="opt">' + esc(ls.tuan + ' / ' + ls.triet) + '</dd>' +
      '</dl></div>';

    h += veDuongTamHop(ls);

    var chEl = document.getElementById('chart');
    if (chEl) chEl.innerHTML = h;
    var oldOpt = document.getElementById('tuviOptBar');
    if (oldOpt) oldOpt.remove();
  } catch (err) {
    console.error('Lỗi khi vẽ lá số:', err);
  }
}
window.veLaSo = veLaSo;

/* ---------- Chi tiết một cung ---------- */
var sheet = $('#sheet');
$('#chart').addEventListener('click', function (e) {
  var b = e.target.closest('.palace'); if (!b || !laSo) return;
  var chi = +b.dataset.chi;
  var c = laSo.cung[chi];
  if (!c) return;
  function chip(s) { return '<span class="st ' + HANH_CLS[s.hanh] + '">' + esc(s.ten) + (s.dacTinhTen ? ' <span class="small" style="font-weight:500">· ' + esc(s.dacTinhTen) + '</span>' : '') + '</span>'; }
  function nhom(ten, ds) { return ds && ds.length ? '<div class="grp"><h4>' + ten + ' (' + ds.length + ')</h4><div class="stars">' + ds.map(chip).join('') + '</div></div>' : ''; }
  var tt = [];
  if (c.laThan) tt.push('Thân cư tại đây'); if (c.tuan) tt.push('Bị Tuần'); if (c.triet) tt.push('Bị Triệt');
  $('#sheetIn').innerHTML = '<div class="sheet-grab" aria-hidden="true"></div><div class="sheet-head"><div><h3 id="sheetTitle">Cung ' + esc(c.ten) + '</h3><div class="muted small">' + esc(c.can + ' ' + c.tenChi) + ' · hành ' + esc(c.hanhCung) + ' · đại vận ' + esc(c.daiVan) + ' tuổi · tiểu hạn ' + esc(c.tieuHan) + (tt.length ? ' · ' + esc(tt.join(', ')) : '') + '</div></div>' +
    '<button class="icon-btn" type="button" id="sheetClose" aria-label="Đóng"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="grp"><h4>Chính tinh</h4>' + (c.chinhTinh.length ? c.chinhTinh.map(function (s) { return '<div class="main-star"><b class="' + HANH_CLS[s.hanh] + '">' + esc(s.ten) + '</b>' + hoaTag(s) + ' <span class="small muted">' + esc((s.dacTinhTen || '') + ' · hành ' + s.hanh) + '</span><div class="small muted">' + esc((TB && TB.NGHIA_SAO && TB.NGHIA_SAO[s.ten]) || '') + '</div></div>'; }).join('') : '<p class="small muted" style="margin:0">Vô chính diệu: không có chính tinh, khi luận mượn sao ở cung đối diện.</p>') + '</div>' +
    nhom('Cát tinh', c.catTinh) + nhom('Hung tinh', c.hungTinh) + nhom('Sao Lưu Niên (2026)', c.luuTinh) +
    '<div class="grp"><h4>Vòng Tràng sinh</h4><div class="small"><b>' + esc(c.trangSinh) + '</b></div></div>';
  if (sheet.showModal) sheet.showModal(); else sheet.setAttribute('open', '');
  var closeBtn = $('#sheetClose');
  if (closeBtn) closeBtn.addEventListener('click', function () { sheet.close(); });
});
sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });

/* ---------- Tải ảnh lá số ---------- */
var dlPromise = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(function () { return null; }) : Promise.resolve(null);
function boDau(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'); }
async function veAnh(ls) {
  try { await Promise.all([document.fonts.load('700 30px "Noto Serif"'), document.fonts.load('600 20px "Be Vietnam Pro"'), document.fonts.load('400 20px "Be Vietnam Pro"')]); } catch (e) {}
  var M = 40, CELL = 300, W = M * 2 + CELL * 4, TOP = 170, H = TOP + CELL * 4 + 150;
  var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  var g = cv.getContext('2d');
  var SERIF = '"Noto Serif", Georgia, serif', SANS = '"Be Vietnam Pro", Arial, sans-serif';
  var C = { bg: '#f4ead5', card: '#fffaf0', ink: '#2a1d14', muted: '#6e5a44', red: '#b3361f', gold: '#f2c76b', menh: '#f6ebc8', paper: '#f3e6c8', night: '#1d1729', line: '#e0d0b0' };
  var HC = { 'Kim': '#5f5f66', 'Mộc': '#2e7d32', 'Thủy': '#1f4e9c', 'Hỏa': '#c0392b', 'Thổ': '#a0600c' };
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  g.fillStyle = C.night; g.fillRect(0, 0, W, 130);
  g.textBaseline = 'middle';
  g.fillStyle = C.gold; g.font = '700 46px ' + SERIF; g.fillText('LÁ SỐ TỬ VI', M, 54);
  g.fillStyle = '#f3e6c8'; g.font = '500 22px ' + SANS; g.fillText((ls.ten ? ls.ten + ' · ' : '') + ls.gioiTinh + ' · tuổi ' + ls.canChi.nam + ' · ' + ls.banMenh, M, 100);
  g.textAlign = 'right'; g.fillStyle = '#c9b896'; g.font = '600 20px ' + SANS; g.fillText('XEMBOI.VN', W - M, 54); g.textAlign = 'left';
  var X0 = M, Y0 = TOP;
  g.fillStyle = C.ink; g.fillRect(X0 - 3, Y0 - 3, CELL * 4 + 6, CELL * 4 + 6);
  function txt(t, x, y, font, color, align) { g.font = font; g.fillStyle = color; g.textAlign = align || 'left'; g.fillText(t, x, y); g.textAlign = 'left'; }
  function fit(t, font, maxW) { g.font = font; if (g.measureText(t).width <= maxW) return t; while (t.length > 1 && g.measureText(t + '…').width > maxW) t = t.slice(0, -1); return t + '…'; }
  var hinhGiap = await Promise.all(GIAP_HINH.map(function (m) { return anhSvg(m, '0 0 100 100', C.ink, C.card); }));
  var hinhBQ = await anhSvg(batQuaiSvg().replace(/^<svg[^>]*>|<\/svg>$/g, ''), '-100 -100 200 200', '#8a5a2b', C.paper);
  ls.cung.forEach(function (c) {
    var p = POS[c.chi], x = X0 + (p[1] - 1) * CELL, y = Y0 + (p[0] - 1) * CELL;
    g.fillStyle = c.ten === 'Mệnh' ? C.menh : C.card; g.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
    if (hinhGiap[c.chi]) { g.globalAlpha = 0.075; g.drawImage(hinhGiap[c.chi], x + CELL - 214, y + CELL - 230, 204, 204); g.globalAlpha = 1; }
    var ix = x + 12, mid = x + CELL / 2;
    txt(c.can + ' ' + c.tenChi, ix, y + 20, '600 15px ' + SANS, C.muted);
    txt(c.ten.toUpperCase(), mid, y + 20, '700 17px ' + SANS, C.red, 'center');
    txt(String(c.daiVanTu), x + CELL - 12, y + 20, '700 17px ' + SANS, C.ink, 'right');
    var ty = y + 44, tags = [];
    if (c.laThan) tags.push(['THÂN', true]); if (c.tuan) tags.push(['TUẦN', false]); if (c.triet) tags.push(['TRIỆT', false]);
    if (tags.length) {
      g.font = '700 13px ' + SANS;
      var tw = tags.reduce(function (s, t) { return s + g.measureText(t[0]).width + 16; }, -6), tx = mid - tw / 2;
      tags.forEach(function (t) {
        var w = g.measureText(t[0]).width + 10;
        if (t[1]) { g.fillStyle = C.ink; g.fillRect(tx, ty - 10, w, 20); g.fillStyle = C.bg; } else { g.strokeStyle = C.muted; g.lineWidth = 1; g.strokeRect(tx + .5, ty - 9.5, w, 19); g.fillStyle = C.muted; }
        g.fillText(t[0], tx + 5, ty + 1); tx += w + 6;
      });
    }
    var cy = tags.length ? y + 72 : y + 52;
    if (c.chinhTinh.length) {
      c.chinhTinh.forEach(function (s) {
        var label = s.ten + (s.dacTinh ? ' (' + s.dacTinh + ')' : '');
        g.font = '700 22px ' + SERIF; var w = g.measureText(label).width, bw = 0;
        if (s.hoa) { g.font = '700 13px ' + SANS; bw = g.measureText(s.hoa.replace('Hóa ', '')).width + 12; }
        var sx = mid - (w + bw) / 2;
        txt(label, sx, cy, '700 22px ' + SERIF, HC[s.hanh]);
        if (s.hoa) { g.fillStyle = C.red; g.fillRect(sx + w + 4, cy - 10, bw - 4, 20); txt(s.hoa.replace('Hóa ', ''), sx + w + 8, cy + 1, '700 13px ' + SANS, '#fff7e6'); }
        cy += 28;
      });
    } else { txt('Vô chính diệu', mid, cy, 'italic 400 19px ' + SERIF, C.muted, 'center'); cy += 28; }
    var cat = c.catTinh.filter(function (s) { return !/^Hóa /.test(s.ten); }), hung = c.hungTinh.filter(function (s) { return s.ten !== 'Hóa Kỵ'; });
    var lh = 19, maxLines = Math.floor((y + CELL - 34 - cy) / lh) + 1, colW = CELL / 2 - 16;
    [[cat, ix, 'left'], [hung, x + CELL - 12, 'right']].forEach(function (col) {
      var ds = col[0], n = Math.min(ds.length, maxLines);
      for (var i = 0; i < n; i++) {
        var s = ds[i], label = (i === n - 1 && ds.length > n) ? '+' + (ds.length - n + 1) + ' sao' : s.ten + (s.dacTinh ? ' ' + s.dacTinh : '');
        txt(fit(label, '500 15px ' + SANS, colW), col[1], cy - 2 + i * lh, '500 15px ' + SANS, (i === n - 1 && ds.length > n) ? C.muted : HC[s.hanh], col[2]);
      }
    });
    g.strokeStyle = C.line; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(x + 10, y + CELL - 28); g.lineTo(x + CELL - 10, y + CELL - 28); g.stroke(); g.setLineDash([]);
    txt(c.trangSinh, ix, y + CELL - 14, '500 14px ' + SANS, C.muted);
    txt('Tiểu hạn ' + c.tieuHan, x + CELL - 12, y + CELL - 14, '500 14px ' + SANS, C.muted, 'right');
  });
  var cx0 = X0 + CELL + 1, cy0 = Y0 + CELL + 1, cw = CELL * 2 - 2;
  g.fillStyle = C.paper; g.fillRect(cx0, cy0, cw, cw);
  if (hinhBQ) { var bq = cw * 0.86; g.globalAlpha = 0.14; g.drawImage(hinhBQ, cx0 + (cw - bq) / 2, cy0 + (cw - bq) / 2, bq, bq); g.globalAlpha = 1; }
  txt(ls.ten || 'Lá số tử vi', cx0 + cw / 2, cy0 + 50, '700 30px ' + SERIF, C.ink, 'center'); txt('XEMBOI.VN', cx0 + cw / 2, cy0 + cw - 22, '700 16px ' + SERIF, C.red, 'center');
  var rows = [['Dương lịch', ls.duong.ngay + '/' + ls.duong.thang + '/' + ls.duong.nam], ['Âm lịch', 'ngày ' + ls.am.ngay + ' tháng ' + ls.am.thang + (ls.am.nhuan ? ' (nhuận)' : '') + ' năm ' + ls.canChi.nam],
    ['Giờ sinh', ls.gio.canChi + ' (' + ls.gio.khoang + ')'], ['Ngày / tháng', ls.canChi.ngay + ' / ' + ls.canChi.thang], ['Âm dương', ls.amDuong + ' · ' + ls.amDuongLy], ['Bản mệnh', ls.banMenh],
    ['Cục', ls.cuc + ' · ' + ls.sinhKhac], ['Mệnh chủ', ls.menhChu], ['Thân chủ', ls.thanChu], ['Tuần / Triệt', ls.tuan + ' / ' + ls.triet]];
  rows.forEach(function (r, i) {
    var ry = cy0 + 112 + i * 42;
    txt(r[0], cx0 + 40, ry, '400 20px ' + SANS, C.muted);
    txt(fit(r[1], '600 20px ' + SANS, cw - 230), cx0 + 200, ry, '600 20px ' + SANS, C.ink);
  });
  try {
    var cvMenh = null, cvTai = null, cvQuan = null, cvDi = null;
    for (var k = 0; k < ls.cung.length; k++) {
      var ck = ls.cung[k];
      if (ck.ten === 'Mệnh') cvMenh = ck;
      else if (ck.ten === 'Tài Bạch') cvTai = ck;
      else if (ck.ten === 'Quan Lộc') cvQuan = ck;
      else if (ck.ten === 'Thiên Di') cvDi = ck;
    }
    var mC = cvMenh ? cvMenh.chi : 2;
    var tC = cvTai ? cvTai.chi : ((mC + 8) % 12);
    var qC = cvQuan ? cvQuan.chi : ((mC + 4) % 12);
    var dC = cvDi ? cvDi.chi : ((mC + 6) % 12);
    var cvPt = function (chi) {
      var p = POS[chi];
      return [X0 + (p[1] - 0.5) * CELL, Y0 + (p[0] - 0.5) * CELL];
    };
    var mP = cvPt(mC), tP = cvPt(tC), qP = cvPt(qC), dP = cvPt(dC);
    g.save();
    g.strokeStyle = 'rgba(179, 54, 31, 0.28)';
    g.lineWidth = 1.8;
    g.beginPath();
    g.moveTo(mP[0], mP[1]);
    g.lineTo(tP[0], tP[1]);
    g.lineTo(qP[0], qP[1]);
    g.closePath();
    g.stroke();
    g.setLineDash([8, 6]);
    g.strokeStyle = 'rgba(179, 54, 31, 0.22)';
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(mP[0], mP[1]);
    g.lineTo(dP[0], dP[1]);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = 'rgba(179, 54, 31, 0.45)';
    [mP, tP, qP, dP].forEach(function (pt) {
      g.beginPath();
      g.arc(pt[0], pt[1], 4, 0, Math.PI * 2);
      g.fill();
    });
    g.restore();
  } catch (e) {}
  var fy = Y0 + CELL * 4 + 36, lx = M;
  [['Kim', 'Kim'], ['Mộc', 'Mộc'], ['Thủy', 'Thủy'], ['Hỏa', 'Hỏa'], ['Thổ', 'Thổ']].forEach(function (h) {
    g.fillStyle = HC[h[0]]; g.fillRect(lx, fy - 7, 14, 14); txt(h[1], lx + 20, fy, '600 16px ' + SANS, HC[h[0]]); g.font = '600 16px ' + SANS; lx += 40 + g.measureText(h[1]).width;
  });
  txt('Trái: cát tinh · Phải: hung tinh · M miếu, V vượng, Đ đắc, B bình, H hãm · Số góc trên: đại vận', lx + 10, fy, '500 16px ' + SANS, C.muted);
  txt('Lập ngày ' + now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear() + ' tại XemBoi.vn. Chỉ mang tính giải trí, tham khảo.', M, fy + 34, '500 16px ' + SANS, C.muted);
  return cv;
}
function hienTaiMsg(t) { $('#taiMsg').textContent = t; }
$('#btnTaiAnh').addEventListener('click', async function () {
  if (!laSo) return;
  try {
    var vid = localStorage.getItem('xb_vid') || 'anon';
    fetch('/api/tracking/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: vid,
        eventType: 'DOWNLOAD_IMAGE',
        path: window.location.pathname,
        metadata: { fullName: laSo.ten, banMenh: laSo.banMenh }
      })
    }).catch(function(){});
  } catch(e) {}
  var btn = this; btn.disabled = true; hienTaiMsg('Đang vẽ ảnh lá số…');
  try {
    var cv = await veAnh(laSo);
    var blob = await new Promise(function (r) { cv.toBlob(r, 'image/png'); });
    var ten = 'la-so-tu-vi-' + (boDau(laSo.ten || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || (laSo.duong.ngay + '-' + laSo.duong.thang + '-' + laSo.duong.nam)) + '.png';
    var dl = await Promise.race([dlPromise, new Promise(function (r) { setTimeout(function () { r(null); }, 1500); })]);
    if (dl) {
      try { await dl.save({ filename: ten, data: blob }); hienTaiMsg('Đã lưu ' + ten); return; }
      catch (e) { if (e && e.code === 'cancelled') { hienTaiMsg(''); return; } }
    }
    var file = typeof File === 'function' ? new File([blob], ten, { type: 'image/png' }) : null;
    var diDong = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (diDong && file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Lá số tử vi' }); hienTaiMsg('Chọn "Lưu hình ảnh" để cất vào máy.'); return; }
      catch (e) { if (e && e.name === 'AbortError') { hienTaiMsg(''); return; } }
    }
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = ten; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    hienTaiMsg('Đã tải ' + ten);
  } catch (e) { hienTaiMsg('Chưa tải được ảnh, con thử lại nhé.'); }
  finally { btn.disabled = false; }
});
$('#btnIn').addEventListener('click', function () { window.print(); });

/* ---------- Hiển thị văn bản luận ---------- */
function md(text) {
  var out = [], list = false;
  function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
  text.split(/\n/).forEach(function (line) {
    var t = line.trim();
    if (/^[-*]\s+/.test(t)) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + inline(t.replace(/^[-*]\s+/, '')) + '</li>'); return; }
    if (list) { out.push('</ul>'); list = false; }
    if (!t) return;
    if (/^#{1,4}\s+/.test(t)) out.push('<h3>' + inline(t.replace(/^#{1,4}\s+/, '')) + '</h3>');
    else out.push('<p>' + inline(t) + '</p>');
  });
  if (list) out.push('</ul>');
  return out.join('');
}
var scene = $('#scene');
function busy(on) { scene.classList.toggle('busy', on); }

var luanCtl = null;
function cho(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// Bản luận cơ bản (miễn phí)
async function goiAI(mode, onText) {
  await ready;
  if (MODE === 'server') {
    var r = await fetch('/api/luan-giai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'soluoc', sinh: sinh, chuDe: chuDe }) });
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(j.loi || 'Thầy đang bận, con thử lại sau nhé.');
    onText(j.text); return j.text;
  }
  if (MODE === 'demo') {
    if (luanCtl) luanCtl.abort();
    luanCtl = new AbortController();
    try {
      var res = await sample(TB.promptSoLuoc(laSo, chuDe), { onText: function (u) { onText(u.text); }, signal: luanCtl.signal });
      return res.text;
    } catch (e) {
      if (e && e.code === 'cancelled') throw e;
      if (e && e.text) { onText(e.text); return e.text; }
      var t = TB.luanDuPhong(laSo, chuDe); onText(t); return t;
    }
  }
  var t2 = TB.luanDuPhong(laSo, chuDe); onText(t2); return t2;
}

/* ---------- Trình bày bản luận như một lá sớ ---------- */
var SO_HAN = ['Nhất', 'Nhị', 'Tam', 'Tứ', 'Ngũ', 'Lục', 'Thất', 'Bát', 'Cửu', 'Thập', 'Thập nhất', 'Thập nhị'];
function inl(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
/** Tách văn bản markdown thành các phần theo tiêu đề "## " */
function tachPhan(text) {
  var out = [], cur = null, chao = [];
  String(text || '').split('\n').forEach(function (line) {
    var m = line.match(/^##\s+(.+)/);
    if (m && !/^###/.test(line)) { cur = { tieuDe: m[1].trim(), text: '' }; out.push(cur); return; }
    if (cur) cur.text += line + '\n'; else chao.push(line);
  });
  return { chao: chao.join('\n').trim(), parts: out };
}
/** Thân một phần: đoạn văn, tiêu đề nhỏ, hộp gạch đầu dòng, dòng thời gian đại vận, lưới tháng */
function thanPhan(text, phanSo) {
  var out = [], ds = [], loaiDs = 'thuong', dauDoan = true, dvNay = null;
  if (laSo) { try { var dvn = TB.daiVanHienTai(laSo, L.duongSangAm(now.getDate(), now.getMonth() + 1, now.getFullYear()).nam); if (dvn.cung) dvNay = dvn.cung.daiVan; } catch (e) {} }
  function xa() {
    if (!ds.length) return;
    var thang = ds.filter(function (x) { return /^\*\*Tháng\s+\d+/i.test(x); });
    var tuoi = ds.filter(function (x) { return /^\*\*\s*\d+\s*[–-]\s*\d+\s*tuổi/i.test(x); });
    if (thang.length >= 6 && thang.length === ds.length) {
      out.push('<div class="thang">' + ds.map(function (x) { var m = x.match(/^\*\*(.+?)\*\*:?\s*(.*)$/); return '<div><b>' + esc(m ? m[1].replace(/:$/, '') : '') + '</b>' + inl(m ? m[2] : x) + '</div>'; }).join('') + '</div>');
    } else if (tuoi.length >= 3 && tuoi.length >= ds.length - 1) {
      out.push('<ul class="dong-tg">' + ds.map(function (x) {
        var m = x.match(/^\*\*(.+?)\*\*:?\s*(.*)$/), t = m ? m[1].replace(/:$/, '') : '';
        var nay = dvNay && t.replace(/\s/g, '').indexOf(dvNay.replace(/\s/g, '')) === 0;
        return '<li' + (nay ? ' class="nay"' : '') + '>' + (m ? '<span class="tuoi">' + esc(t) + (nay ? ' · đang đi' : '') + '</span>' + inl(m[2]) : inl(x)) + '</li>';
      }).join('') + '</ul>');
    } else {
      out.push('<ul class="hop ' + loaiDs + '">' + ds.map(function (x) { return '<li>' + inl(x) + '</li>'; }).join('') + '</ul>');
    }
    ds = [];
  }
  String(text || '').split('\n').forEach(function (line) {
    var t = line.trim();
    if (/^[-*]\s+/.test(t)) { ds.push(t.replace(/^[-*]\s+/, '')); return; }
    xa();
    if (!t) return;
    var h = t.match(/^#{3,4}\s+(.+)/);
    if (h) {
      var ten = h[1].trim();
      loaiDs = /mạnh|hợp|thuận|tốt|vượng|nên làm/i.test(ten) ? 'tot' : /cần|giữ|lưu ý|tránh|thận trọng|kiêng/i.test(ten) ? 'luu' : 'thuong';
      out.push('<h4 class="nhan">' + inl(ten) + '</h4>'); return;
    }
    out.push('<p' + (dauDoan ? ' class="dau"' : '') + '>' + inl(t) + '</p>'); dauDoan = false;
  });
  xa();
  return out.join('');
}
/** parts: [{tieuDe, text|loi|null}]; opt: {chao, dayDu, xong} */
function veSo(parts, opt) {
  opt = opt || {};
  var ten = (laSo && laSo.ten) ? laSo.ten : 'con';
  var h = '<div class="so"><div class="so-dau"><div class="nho">' + esc(opt.nho || (opt.dayDu ? 'Lá sớ Danh Sư luận kỹ' : 'Danh Sư luận giải sơ khởi')) + '</div>' +
    '<div class="lon">' + esc(opt.lon || (opt.dayDu ? 'Bản luận của ' + ten : (laSo && laSo.ten ? laSo.ten : 'Lời thầy luận'))) + '</div>' +
    (opt.meta ? '<div class="meta">' + esc(opt.meta) + '</div>' : laSo && !opt.lon ? '<div class="meta">Tuổi ' + esc(laSo.canChi.nam) + ' · ' + esc(laSo.banMenh) + ' · ' + esc(laSo.cuc) + ' · luận ngày ' + now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear() + '</div>' : '') + '</div>';
  if (parts.length > 2) h += '<nav class="muc-luc" aria-label="Mục lục bản luận">' + parts.map(function (p, i) { return '<button type="button" data-phan="' + i + '" data-id="' + (opt.idp || 'phan-') + i + '"' + (p.text ? '' : ' class="cho"') + '>' + (i + 1) + '. ' + esc(p.tieuDe.replace(/:.*/, '')) + '</button>'; }).join('') + '</nav>';
  if (opt.chao) h += '<p class="loi-chao">' + inl(opt.chao) + '</p>';
  parts.forEach(function (p, i) {
    var body = p.text || p.dang;
    var chaoPhan = '';
    if (body) {
      var t = tachPhan(body);
      if (t.parts.length) { chaoPhan = t.chao; body = t.parts.map(function (x) { return x.text; }).join('\n'); }
    }
    h += '<section class="phan" id="' + (opt.idp || 'phan-') + i + '"><div class="phan-dau"><span class="phan-so" aria-hidden="true">' + (SO_HAN[i] || i + 1) + '</span><h3 class="phan-ten">' + esc(p.tieuDe) + '</h3></div>';
    if (chaoPhan && i === 0 && !opt.chao) h += '<p class="loi-chao">' + inl(chaoPhan) + '</p>';
    if (body) h += thanPhan(body, i) + (p.text ? '' : '<p class="dang-viet"><span class="but"></span>Thầy đang viết tiếp…</p>');
    else if (p.loi) h += '<p class="err">' + esc(p.loi) + '</p>';
    else h += '<div class="phan-cho"><span class="spinner"></span>' + (p.choLuot ? 'Chợ đông, thầy đang chờ lượt viết phần này. Con đọc các phần khác trước nhé…' : 'Thầy đang viết phần này…') + '</div>';
    if (opt.danhGia && p.text && !/Bản đầy đủ có gì|Muốn thầy xem kỹ/.test(p.tieuDe)) h += '<div class="danh-gia" data-kieu="' + opt.danhGia + '" data-muc="' + esc(mucDanhGia(opt.danhGia, p.tieuDe, i)) + '"><span>Thầy nói phần này có đúng không?</span><button type="button" data-d="1">Đúng</button><button type="button" data-d="-1">Chưa đúng</button></div>';
    h += '</section>';
  });
  if (opt.xong) h += '<div class="an-thay"><div class="an" aria-label="Ấn Danh Sư">DANH SƯ<small>XEMBOI.VN</small></div><p>Đức năng thắng số.</p></div>';
  return h + '</div>';
}
/** Khóa của một phần để thống kê chấm điểm: bỏ tên riêng, năm, can chi */
function mucDanhGia(kieu, tieuDe, i) {
  if (kieu === 'trondoi') return tieuDe.replace(/ tuổi .*$/, '').slice(0, 50);
  if (kieu === 'nam' || kieu === 'hop') return 'Phần ' + (i + 1) + ': ' + tieuDe.replace(/^(Tuổi|Sao chiếu mệnh|Vận hạn).*$/, '$1').replace(/\s*:.*$/, '').replace(/ năm .*$/, '').slice(0, 40);
  if (kieu === 'hopky') return 'Phần ' + (i + 1);
  return tieuDe.replace(/\d{4}/g, '').replace(/(Vận năm|Đón năm) .*/, '$1').replace(/\s*·.*$/, '').trim().slice(0, 50);
}
var LY_DO = [['khong-giong', 'Không giống con'], ['chung-chung', 'Chung chung quá'], ['kho-hieu', 'Khó hiểu'], ['dai-qua', 'Dài quá'], ['so-hai', 'Làm con lo']];
document.addEventListener('click', function (e) {
  var b = e.target.closest('.danh-gia button'); if (!b) return;
  var hop = b.closest('.danh-gia'), kieu = hop.dataset.kieu, muc = hop.dataset.muc;
  var gui = function (body) { fetch('/api/danh-gia', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.assign({ kieu: kieu, muc: muc }, body)) }).catch(function () {}); };
  if (b.dataset.ly) { gui({ diem: -1, lyDo: b.dataset.ly }); hop.innerHTML = '<span>Thầy ghi nhận rồi, lần sau thầy nói kỹ hơn. Cảm ơn con.</span>'; return; }
  var d = +b.dataset.d; gui({ diem: d });
  if (d > 0) hop.innerHTML = '<span>Khà khà, thầy cảm ơn con.</span>';
  else hop.innerHTML = '<span>Chưa đúng ở chỗ nào con?</span>' + LY_DO.map(function (x) { return '<button type="button" data-ly="' + x[0] + '">' + x[1] + '</button>'; }).join('');
});
function veCacPhan(parts) {
  var xong = parts.length && parts.every(function (p) { return p.text; });
  return veSo(parts, { dayDu: true, xong: xong, danhGia: xong ? 'daydu' : null });
}
function veVanBan(text, dayDu) {
  var t = tachPhan(text);
  if (!t.parts.length) return md(text);
  return veSo(t.parts, { chao: t.chao, dayDu: dayDu, xong: true, danhGia: dayDu ? 'daydu' : 'mienphi' });
}
document.addEventListener('click', function (e) {
  var b = e.target.closest('.muc-luc button'); if (!b) return;
  var s = document.getElementById(b.dataset.id || 'phan-' + b.dataset.phan); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
async function luanDayDu(onParts) {
  await ready;
  var parts = [];
  if (MODE === 'server') {
    for (var lan = 0; lan < 40; lan++) {
      var r = await fetch('/api/luan-giai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode: 'daydu', don: donHienTai && donHienTai.id }) });
      if (!r.ok) { var j = await r.json().catch(function () { return {}; }); throw new Error(j.loi || 'Thầy đang bận, con thử lại sau nhé.'); }
      var xong = false, thieu = false, dangViet = false, conTiep = false;
      // phần đang viết dở ở lượt trước sẽ được viết lại từ đầu: xóa chữ dở để không bị chắp vá
      parts.forEach(function (p, k) { if (!p.text && p.dang) parts[k] = { tieuDe: p.tieuDe }; });
      var xuLy = function (line) {
        if (!line.trim()) return;
        var o; try { o = JSON.parse(line); } catch (e) { return; }
        if (o.tong) { if (!parts.length) parts = o.tieuDe.map(function (t) { return { tieuDe: t }; }); }
        else if (typeof o.i === 'number' && parts[o.i]) {
          var td = parts[o.i].tieuDe;
          if (o.text) parts[o.i] = { tieuDe: td, text: o.text };
          else if (o.loi) parts[o.i] = { tieuDe: td, loi: o.loi };
          else if (o.them) parts[o.i] = { tieuDe: td, dang: (parts[o.i].dang || '') + o.them };
          else if (o.lamLai) parts[o.i] = { tieuDe: td, choLuot: !!o.choLuot };
        }
        if (o.dangViet) dangViet = true;
        if (o.xong && o.conTiep) { conTiep = true; }
        else if (o.xong) { xong = true; thieu = !!o.thieu; }
        onParts(parts);
      };
      try {
        if (r.body && r.body.getReader) {
          var reader = r.body.getReader(), dec = new TextDecoder(), buf = '';
          for (;;) {
            var x = await reader.read(); if (x.done) break;
            buf += dec.decode(x.value, { stream: true });
            var lines = buf.split('\n'); buf = lines.pop(); lines.forEach(xuLy);
          }
          xuLy(buf);
        } else (await r.text()).split('\n').forEach(xuLy);
      } catch (e) { /* mất kết nối giữa chừng: hỏi lại, máy chủ trả tiếp các phần đã viết */ }
      if (xong) return { parts: parts, thieu: thieu || parts.some(function (p) { return !p.text; }) };
      await cho(conTiep ? 300 : dangViet ? 5000 : 1500);
    }
    return { parts: parts, thieu: true };
  }
  var ds = TB.cacPhanDayDu(chuDe, TB.duLieuLuan(laSo).namNay, TB.namSauCuaNgay());
  parts = ds.map(function (p) { return { tieuDe: p.tieuDe }; });
  onParts(parts);
  if (MODE === 'demo') {
    var thieuDemo = false;
    for (var i = 0; i < ds.length; i++) {
      try {
        var res = await sample(TB.promptPhan(laSo, chuDe, ds[i], i, ds.length), { modelTier: 'default', onText: function (u) { parts[i] = { tieuDe: ds[i].tieuDe, text: u.text }; onParts(parts); } });
        parts[i] = { tieuDe: ds[i].tieuDe, text: res.text };
      } catch (e) {
        if (e && e.text) parts[i] = { tieuDe: ds[i].tieuDe, text: e.text };
        else { parts[i] = { tieuDe: ds[i].tieuDe, loi: 'Phần này chưa viết được.' }; thieuDemo = true; }
      }
      onParts(parts);
    }
    return { parts: parts, thieu: thieuDemo };
  }
  parts = [{ tieuDe: 'Lời thầy', text: TB.luanDuPhong(laSo, chuDe) }]; onParts(parts);
  return { parts: parts, thieu: false };
}

async function lapLuan() {
  var el = $('#reading');
  $('#readTitle').textContent = 'Lời thầy luận · ' + TB.CHU_DE[chuDe].ten;
  el.innerHTML = '<p class="muted"><span class="spinner" style="vertical-align:-3px;margin-right:8px"></span>Thầy đang bấm đốt tay: Tý, Sửu, Dần, Mão…</p>';
  say('Để thầy bấm quẻ xem nào… Tý, Sửu, Dần, Mão…');
  busy(true);
  $('#result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  try {
    await ready;
    if (MODE === 'server' && CFG && CFG.mienPhiAI) await goiAI('soluoc', function (t) { el.innerHTML = veVanBan(t, false); });
    else { await cho(1400); el.innerHTML = veVanBan(window.ThuVien.luan(laSo, chuDe), false); }
    say('Đấy, thầy nói những nét chính. Muốn biết kỹ từng cung, từng vận, từng tháng thì gửi lễ, thầy xem kỹ cho.');
    $('#docHanhDong').classList.remove('hidden');
  } catch (e) {
    if (e && e.code === 'cancelled') return;
    el.innerHTML = md(TB.luanDuPhong(laSo, chuDe));
    say('Hôm nay chợ đông, thầy nói vắn tắt vậy.');
  } finally { busy(false); }
}

/* ---------- Gửi lễ ---------- */
var MUC = [{ v: 10000, t: 'Lễ nhỏ' }, { v: 20000, t: 'Lễ vừa' }, { v: 50000, t: 'Lễ khá' }, { v: 100000, t: 'Lễ lớn' }, { v: 200000, t: 'Lễ hậu' }];
var mucChon = 20000, donHienTai = null, pollTimer = null;
$('#amounts').innerHTML = MUC.map(function (m) { return '<button class="amt" type="button" data-v="' + m.v + '" aria-pressed="' + (m.v === mucChon) + '">' + money(m.v) + '<small>' + m.t + '</small></button>'; }).join('');
$('#amounts').addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b) return;
  mucChon = +b.dataset.v; $('#customAmt').value = '';
  $('#amounts').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
});
$('#customAmt').addEventListener('input', function () {
  var v = parseInt(this.value.replace(/\D/g, ''), 10);
  this.value = v ? v.toLocaleString('vi-VN') : '';
  if (v) { mucChon = v; $('#amounts').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); }
});
function resetPay() {
  clearInterval(pollTimer); donHienTai = null;
  $('#qrArea').classList.add('hidden'); $('#qrArea').innerHTML = ''; $('#btnPay').classList.remove('hidden'); $('#payErr').textContent = '';
  $('#payCard').classList.remove('hidden');
}
function copyBtn(v) { return '<button class="copy" type="button" data-copy="' + esc(v) + '">Chép</button>'; }
$('#qrArea').addEventListener('click', function (e) {
  var b = e.target.closest('[data-copy]'); if (b && navigator.clipboard) { navigator.clipboard.writeText(b.dataset.copy).then(function () { b.textContent = 'Đã chép'; }, function () {}); }
  if (e.target.closest('#btnFakePaid')) moBanDayDu();
});

$('#btnPay').addEventListener('click', async function () {
  await ready;
  var min = (CFG && CFG.minAmount) || 10000, err = $('#payErr'); err.textContent = '';
  if (mucChon < min) { err.textContent = 'Lễ tối thiểu ' + money(min) + ' con nhé.'; return; }
  var btn = this; btn.disabled = true;
  try {
    if (MODE === 'server') {
      var r = await fetch('/api/tao-don', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sinh: sinh, chuDe: chuDe, soTien: mucChon, loai: 'daydu', phien: PHIEN }) });
      var j = await r.json();
      if (!r.ok) throw new Error(j.loi || 'Không tạo được mã chuyển khoản.');
      donHienTai = j; ls_set('chotuvi_don', { id: j.id, sinh: sinh, chuDe: chuDe }); luuDonTheoLaSo(j.id);
      hienQR(j); batDauCho();
    } else {
      donHienTai = { id: 'THU' + Math.random().toString(36).slice(2, 7).toUpperCase(), soTien: mucChon };
      hienQRThu(donHienTai);
    }
    btn.classList.add('hidden');
  } catch (e) { err.textContent = e.message; } finally { btn.disabled = false; }
});
var diDongNH = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
function linkApp(app, d) {
  return 'https://dl.vietqr.io/pay?app=' + encodeURIComponent(app.appId) + '&ba=' + encodeURIComponent(d.soTaiKhoan) + '@' + encodeURIComponent(d.maNganHang || '') +
    '&am=' + d.soTien + '&tn=' + encodeURIComponent(d.noiDung) + '&bn=' + encodeURIComponent(d.chuTaiKhoan || '') + '&url=' + encodeURIComponent(location.origin + '/');
}
async function veAppNganHang(d) {
  var luoi = $('#appLuoi'); if (!luoi) return;
  var os = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : 'android';
  var apps = [];
  try { apps = (await (await fetch('/api/ngan-hang?os=' + os)).json()).apps || []; } catch (e) {}
  if (!apps.length) { luoi.closest('.mo-app').classList.add('hidden'); return; }
  // đưa app cùng ngân hàng nhận tiền lên đầu
  apps.sort(function (x, y) { return (y.appId === d.maNganHang) - (x.appId === d.maNganHang) || (y.tuDien - x.tuDien); });
  luoi.innerHTML = apps.slice(0, 12).map(function (ap) {
    var ten = String(ap.appName || ap.appId).replace(/\s*(Mobile Banking|SmartBanking|Smart Banking|Digital Banking)\s*/i, ' ').trim();
    return '<a class="app-nh" href="' + esc(linkApp(ap, d)) + '" data-app="' + esc(ap.appId) + '">' + (ap.tuDien ? '<span class="td">Tự điền</span>' : '') +
      (ap.appLogo ? '<img src="' + esc(ap.appLogo) + '" alt="" loading="lazy">' : '<span class="chu">' + esc(ap.appId.slice(0, 3)) + '</span>') + '<span>' + esc(ten.slice(0, 22)) + '</span></a>';
  }).join('');
  luoi.addEventListener('click', function (e) {
    var a = e.target.closest('.app-nh'); if (!a) return;
    try { navigator.clipboard && navigator.clipboard.writeText(d.noiDung); } catch (x) {}
    var g = $('#appGoiY'); if (g) g.textContent = 'Đang mở app… Nội dung "' + d.noiDung + '" đã được chép sẵn, nếu app chưa điền thì con dán vào ô nội dung nhé.';
  });
}
async function luuQR(d) {
  try {
    var blob = await (await fetch(d.qr)).blob();
    var file = new File([blob], 'ma-qr-chotuvi-' + d.id + '.png', { type: blob.type || 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Mã QR chuyển lễ' }); return; }
    var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  } catch (e) { if (!e || e.name !== 'AbortError') window.open(d.qr, '_blank'); }
}
function hienQR(d, khung) {
  var a = khung || $('#qrArea'); a.classList.remove('hidden');
  var appHtml = diDongNH ? '<div class="mo-app"><h3>Chuyển nhanh: bấm vào app ngân hàng của con</h3><div class="app-luoi" id="appLuoi"><span class="small muted">Đang tải danh sách ngân hàng…</span></div>' +
    '<p class="small muted" id="appGoiY" style="margin:0 0 10px">App có nhãn "Tự điền" sẽ điền sẵn số tiền và nội dung. App khác thầy chép sẵn nội dung, con chỉ việc dán.</p>' +
    '<button class="btn ghost block" type="button" id="btnLuuQR">Lưu mã QR vào máy để quét trong app</button></div><div class="hoac">hoặc quét mã QR</div>' : '';
  a.innerHTML = appHtml + '<div class="qr-box"><img src="' + esc(d.qr) + '" alt="Mã VietQR chuyển ' + esc(money(d.soTien)) + '" width="220" height="220">' +
    '<dl class="qr-info"><dt>Ngân hàng</dt><dd>' + esc(d.nganHang) + '</dd><dt>Số tài khoản</dt><dd>' + esc(d.soTaiKhoan) + copyBtn(d.soTaiKhoan) + '</dd>' +
    '<dt>Chủ tài khoản</dt><dd>' + esc(d.chuTaiKhoan) + '</dd><dt>Số tiền</dt><dd>' + esc(money(d.soTien)) + '</dd>' +
    '<dt>Nội dung</dt><dd>' + esc(d.noiDung) + copyBtn(d.noiDung) + '</dd></dl></div>' +
    '<p class="small muted">' + (diDongNH ? 'Đang dùng máy tính bảng hay điện thoại khác? Mở app ngân hàng và quét mã QR. ' : 'Mở app ngân hàng trên điện thoại, quét mã QR. ') + 'Giữ nguyên nội dung chuyển khoản để thầy nhận ra lễ của con.</p>' +
    '<div class="waiting" id="waiting"><div class="w-thay" aria-hidden="true"></div><div><div class="w-loi" id="wLoi">Thầy đang ngồi chờ lễ của con…</div><div class="w-sub"><span class="dot3"><span></span><span></span><span></span></span><span id="wSub">Ngân hàng báo tiền về thường dưới 1 phút</span></div></div></div>';
  var wt = a.querySelector('.w-thay'); if (wt) wt.appendChild(banSaoThay(true));
  chayLoiCho();
  if (diDongNH) { veAppNganHang(d); $('#btnLuuQR').addEventListener('click', function () { luuQR(d); }); }
  a.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function hienQRThu(d) {
  var a = $('#qrArea'); a.classList.remove('hidden');
  var cells = '', seed = 7;
  function inFinder(x, y) { return (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12); }
  for (var i = 0; i < 21 * 21; i++) { seed = (seed * 9301 + 49297) % 233280; var x = i % 21, y = Math.floor(i / 21);
    if (!inFinder(x, y) && seed / 233280 > 0.5) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'; }
  [[0, 0], [14, 0], [0, 14]].forEach(function (p) {
    cells += '<rect x="' + (p[0] + .5) + '" y="' + (p[1] + .5) + '" width="6" height="6" fill="none" stroke="#1d1729" stroke-width="1"/><rect x="' + (p[0] + 2) + '" y="' + (p[1] + 2) + '" width="3" height="3"/>';
  });
  a.innerHTML = '<div class="qr-box"><svg class="qr-fake" viewBox="-2 -2 25 25" role="img" aria-label="Mã QR minh họa"><rect x="-2" y="-2" width="25" height="25" fill="#fff"/><g fill="#1d1729">' + cells + '</g></svg>' +
    '<dl class="qr-info"><dt>Ngân hàng</dt><dd>[NGÂN HÀNG CỦA BẠN]</dd><dt>Số tài khoản</dt><dd>[SỐ TÀI KHOẢN]</dd><dt>Số tiền</dt><dd>' + esc(money(d.soTien)) + '</dd><dt>Nội dung</dt><dd>TUVI ' + esc(d.id) + '</dd></dl></div>' +
    '<p class="demo-note">Đây là bản chạy thử, chưa nối tài khoản ngân hàng nên mã QR chỉ để minh họa. Khi đưa lên mạng, mã QR thật sẽ hiện ở đây và tự mở khóa khi tiền về.</p>' +
    '<button class="btn red block" id="btnFakePaid" type="button" style="margin-top:10px">Bản thử: coi như thầy đã nhận lễ</button>';
}
function batDauCho(idDon, khiXong) {
  idDon = idDon || (donHienTai && donHienTai.id); khiXong = khiXong || moBanDayDu;
  var start = Date.now();
  clearInterval(pollTimer);
  pollTimer = setInterval(async function () {
    if (Date.now() - start > 20 * 60 * 1000) { clearInterval(pollTimer); clearInterval(loiChoTimer); var w = $('#wLoi'); if (w) w.textContent = 'Chưa thấy lễ về. Nếu con đã chuyển, tải lại trang sau ít phút.'; return; }
    try {
      var r = await fetch('/api/don?id=' + encodeURIComponent(idDon)); var j = await r.json();
      if (j.trangThai === 'da_tra') { clearInterval(pollTimer); clearInterval(loiChoTimer); var w = $('#wLoi'); if (w) w.textContent = 'Thầy nhận được lễ rồi! Ngồi xuống đây con…'; setTimeout(khiXong, 900); }
    } catch (e) {}
  }, 3000);
}
/* ---------- Màn hình "thầy đang luận" ---------- */
function banSaoThay(nhanh) {
  var svg = $('#scene svg').cloneNode(true);
  svg.removeAttribute('aria-hidden'); svg.setAttribute('aria-hidden', 'true');
  if (nhanh) svg.querySelectorAll('.hand').forEach(function (h) { h.style.animationDuration = '.35s'; });
  return svg;
}
var loiChoTimer = null;
function chayLoiCho() {
  var LOI = ['Thầy đang ngồi chờ lễ của con…', 'Con quét mã rồi thì cứ để đó, thầy tự biết…', 'Thầy pha ấm trà, chờ ngân hàng báo về…', 'Có lễ là thầy bắt tay vào luận ngay…', 'Khụ khụ… chợ hôm nay đông, nhưng thầy ưu tiên con.'];
  var i = 0; clearInterval(loiChoTimer);
  loiChoTimer = setInterval(function () {
    var w = $('#wLoi'); if (!w) { clearInterval(loiChoTimer); return; }
    w.style.opacity = 0; setTimeout(function () { i = (i + 1) % LOI.length; w.textContent = LOI[i]; w.style.opacity = 1; }, 350);
  }, 3800);
}
var DL = (function () {
  var el = $('#dangLuan'), timer = null, creep = 0, tong = 0, xong = 0, moLuc = 0, mo = false, batDau = 0, daTuDong = false;
  function loiThay() {
    var L1 = ['Thầy bấm đốt tay: Tý, Sửu, Dần, Mão…', 'Thầy đang an lại các sao trên lá số của con…', 'Xét tam phương tứ chính cung Mệnh…', 'Thầy lật sách cụ Thiên Lương ra đối chiếu…', 'Đại vận này sao gì chiếu đây nhỉ…', 'Thầy bấm từng tháng: tháng Giêng, tháng Hai…', 'Uống ngụm trà rồi thầy luận tiếp…', 'Xem Tuần, Triệt chặn ở cung nào…', 'Thầy viết cẩn thận, con chờ thầy chút…'];
    if (laSo) {
      var m = laSo.cung.filter(function (c) { return c.ten === 'Mệnh'; })[0];
      if (m && m.chinhTinh.length) L1.splice(1, 0, 'Cung Mệnh con có ' + m.chinhTinh.map(function (x) { return x.ten; }).join(', ') + '… để thầy xem kỹ.');
      L1.splice(3, 0, 'Bản mệnh ' + laSo.banMenh + ', ' + laSo.cuc + '… thầy tính sinh khắc.');
      var pt = laSo.cung.filter(function (c) { return c.ten === 'Phu Thê'; })[0];
      if (pt && pt.chinhTinh.length) L1.push('Cung Phu Thê có ' + pt.chinhTinh[0].ten + '… chuyện duyên phận đây.');
      var tb = laSo.cung.filter(function (c) { return c.ten === 'Tài Bạch'; })[0];
      if (tb && tb.chinhTinh.length) L1.push('Cung Tài Bạch có ' + tb.chinhTinh[0].ten + '… lộc của con nằm đây.');
    }
    return L1;
  }
  function doiLoi() {
    var ds = loiThay(), p = $('#dlLoi');
    p.style.opacity = 0;
    setTimeout(function () { p.textContent = ds[Math.floor((Date.now() / 4000)) % ds.length]; p.style.opacity = 1; }, 350);
  }
  function veThanh() {
    if (!tong) return;
    // thanh tiến độ luôn nhích dần, không bao giờ đứng yên
    var giay = (Date.now() - moLuc) / 1000;
    creep = Math.min(0.85, 1 - Math.exp(-giay / 25));
    var pct = Math.min(99, Math.round(((xong + creep * (tong - xong > 0 ? 1 : 0)) / tong) * 100));
    if (xong === tong) pct = 100;
    $('#dlBar').style.width = pct + '%';
    $('#dlPct').textContent = pct + '% · đã xong ' + xong + '/' + tong + ' phần';
  }
  function moRa() {
    if (mo) return; mo = true; moLuc = Date.now(); batDau = Date.now(); daTuDong = false; tong = 0; xong = 0;
    var t = $('#dlThay'); t.querySelectorAll('svg').forEach(function (x) { x.remove(); }); t.insertBefore(banSaoThay(true), t.firstChild);
    $('#dlList').innerHTML = ''; $('#dlDoc').classList.add('hidden');
    $('#dlTitle').textContent = 'Thầy đang luận quẻ cho con';
    $('#dlLoi').textContent = 'Thầy nhận lễ rồi. Ngồi xuống đây, thầy xem kỹ cho…';
    $('#dlBar').style.width = '2%'; $('#dlPct').textContent = '';
    el.classList.remove('hidden'); document.body.style.overflow = 'hidden';
    clearInterval(timer);
    timer = setInterval(function () { doiLoi(); }, 4000);
    (function vong() { if (!mo) return; veThanh(); setTimeout(vong, 600); })();
  }
  function capNhat(parts) {
    if (!mo || !parts.length) return;
    tong = parts.length;
    var moiXong = parts.filter(function (p) { return p.text; }).length;
    if (moiXong > xong) { moLuc = Date.now(); }
    xong = moiXong;
    var dangIdx = parts.findIndex(function (p) { return !p.text && !p.loi; });
    var coChu = parts.some(function (p) { return (p.text || p.dang || '').length > 300; });
    if (coChu && Date.now() - batDau > 6000 && !daTuDong) { daTuDong = true; setTimeout(function () { dong(); }, 400); }
    $('#dlList').innerHTML = parts.map(function (p, i) {
      var cls = p.text ? 'xong' : (p.dang || i === dangIdx ? 'dang' : '');
      var ic = p.text ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9fd4a6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>'
        : p.loi ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f2a08e" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 7v6M12 17v.5"/></svg>'
        : (p.dang || i === dangIdx ? '<span class="spinner"></span>' : '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="#5a4a3a"/></svg>');
      return '<li class="' + cls + '"><span class="dl-ic">' + ic + '</span>' + esc(p.tieuDe) + '</li>';
    }).join('');
    if (xong > 0) $('#dlDoc').classList.remove('hidden');
    veThanh();
  }
  function dong(thongDiep) {
    if (!mo) return;
    if (thongDiep) {
      $('#dlTitle').textContent = thongDiep; $('#dlLoi').textContent = 'Con đọc kỹ nhé. Đức năng thắng số!';
      $('#dlBar').style.width = '100%';
      clearInterval(timer);
      setTimeout(dongNgay, 1600);
    } else dongNgay();
  }
  function dongNgay() {
    mo = false; clearInterval(timer); el.classList.add('hidden'); document.body.style.overflow = '';
    var r = $('#readTitle'); if (r) r.closest('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $('#dlDoc').addEventListener('click', dongNgay);
  return { mo: moRa, capNhat: capNhat, dong: dong };
})();

async function moBanDayDu() {
  $('#payCard').classList.add('hidden');
  var el = $('#reading');
  $('#readTitle').textContent = 'Lời thầy luận đầy đủ · ' + TB.CHU_DE[chuDe].ten;
  el.innerHTML = '<p class="muted"><span class="spinner" style="vertical-align:-3px;margin-right:8px"></span>Thầy đang luận, chữ sẽ hiện ra ngay khi thầy viết…</p>';
  say('Thầy nhận lễ rồi. Ngồi xuống đây, thầy xem kỹ cho.');
  busy(true);
  DL.mo();
  try {
    var hen = null, cuoi = null;
    var ve = function () { hen = null; if (cuoi) { el.innerHTML = veCacPhan(cuoi); DL.capNhat(cuoi); } };
    var kq = await luanDayDu(function (parts) { cuoi = parts; if (!hen) hen = setTimeout(ve, 250); });
    clearTimeout(hen); ve();
    if (kq.thieu) {
      DL.dong();
      el.insertAdjacentHTML('beforeend', '<p class="muted small">Còn phần thầy chưa viết xong (thường do máy AI đang đông).</p><button class="btn gold" type="button" id="retryFull">Nhờ thầy luận tiếp</button>');
      $('#retryFull').addEventListener('click', moBanDayDu);
      say('Chợ đông quá, còn mấy phần thầy viết dở. Con bấm nhờ thầy luận tiếp nhé.');
    } else {
      DL.dong('Thầy luận xong rồi!');
      HOI.taiLai();
      if (donHienTai) ls_set('chotuvi_bdd2_' + donHienTai.id, kq.parts.map(function (p) { return p.text || ''; }).join('\n\n'));
      say('Thầy nói hết rồi đấy. Nhớ lời thầy dặn: đức năng thắng số.');
      $('#docHanhDong').classList.remove('hidden');
    }
  } catch (e) {
    DL.dong();
    el.innerHTML = '<p class="err">' + esc(e.message || 'Có lỗi') + '</p><button class="btn gold" type="button" id="retryFull">Nhờ thầy luận lại</button>';
    $('#retryFull').addEventListener('click', moBanDayDu);
  } finally { busy(false); }
}

/* ---------- Nghe thầy đọc (giọng đọc có sẵn trong máy) ---------- */
window.DOC = DOC = (function () {
  var tts = window.speechSynthesis, CO = !!(tts && window.SpeechSynthesisUtterance);
  var TOC = [0.9, 1, 1.15, 1.3, 0.8], tocI = 1;
  try { var t0 = parseInt(ls_get('chotuvi_tocdo'), 10); if (TOC[t0]) tocI = t0; } catch (e) {}
  var goc = null, khoi = 0, doan = 0, chay = false, phien = 0, giong = null, nutDang = null, hen = null;
  var SEL_SO = '.so-dau .lon, .so > .loi-chao, .phan-dau, .phan > p:not(.dang-viet):not(.err), .phan > .loi-chao, .phan h4, .phan li, .thang > div, .an-thay p';
  var SEL_THUONG = 'h2, h3, h4, p, li';
  function chonGiong() {
    if (!CO) return null;
    var vs = tts.getVoices() || [];
    var vi = vs.filter(function (v) { return /^vi([-_]|$)/i.test(v.lang || ''); });
    if (!vs.length) return undefined;           // máy chưa nạp danh sách giọng
    if (!vi.length) return null;                // không có giọng tiếng Việt
    vi.sort(function (a, b) { return diem(b) - diem(a); });
    return vi[0];
  }
  // Giọng nam đã biết: Microsoft An, NamMinh (Edge); giọng nữ: Linh (iPhone), HoaiMy, Lan…
  function laNam(v) { var n = (v && v.name) || ''; return /\ban\b|nam ?minh|\bmale\b/i.test(n) && !/female|hoai ?my|linh|lan\b|mai\b/i.test(n); }
  function diem(v) { var n = v.name || ''; return (laNam(v) ? 10 : 0) + (/natural|neural|online|premium|enhanced/i.test(n) ? 2 : 0) + (v.localService ? 1 : 0); }
  if (CO && tts.addEventListener) tts.addEventListener('voiceschanged', function () { giong = chonGiong(); });
  function cacKhoi() {
    if (!goc || !goc.isConnected) return [];
    var ds = [].slice.call(goc.querySelectorAll(goc.querySelector('.so') ? SEL_SO : SEL_THUONG));
    if (!ds.length && goc.textContent.trim()) ds = [goc];
    return ds.filter(function (el) { return chuCua(el).length > 1; });
  }
  function chuCua(el) {
    var c = el.cloneNode(true);
    c.querySelectorAll('.ten, button, .spinner, svg').forEach(function (x) { x.remove(); });
    var t;
    if (el.classList.contains('phan-dau')) {
      var so = el.querySelector('.phan-so'), ten = el.querySelector('.phan-ten');
      t = 'Phần ' + (so ? so.textContent : '') + '. ' + (ten ? ten.textContent : '') + '.';
    } else {
      var dau = c.firstElementChild;
      if (dau && /^(B|SPAN)$/.test(dau.tagName) && (dau.classList.contains('tuoi') || el.parentNode.classList.contains('thang'))) dau.textContent = dau.textContent + ': ';
      t = c.textContent;
    }
    return lamSach(t);
  }
  function lamSach(t) {
    return String(t)
      .replace(/(\d)\s*[–-]\s*(\d)/g, '$1 đến $2')
      .replace(/[·•|]/g, ', ').replace(/→|⇒/g, ', rồi ')
      .replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, '')
      .replace(/[*#_`>]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  /** Cắt câu dài thành đoạn ngắn (Chrome tự ngắt nếu một lần đọc quá dài) */
  function cat(t) {
    var cau = t.match(/[^.!?…;:]+[.!?…;:]*\s*/g) || [t], out = [], cur = '';
    cau.forEach(function (c) {
      while (c.length > 220) { var k = c.lastIndexOf(',', 200); if (k < 60) k = c.lastIndexOf(' ', 200); if (k < 60) k = 200; out.push((cur + c.slice(0, k + 1)).trim()); cur = ''; c = c.slice(k + 1); }
      if ((cur + c).length > 220) { if (cur.trim()) out.push(cur.trim()); cur = c; } else cur += c;
    });
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function boToSang() { document.querySelectorAll('.dang-doc').forEach(function (x) { x.classList.remove('dang-doc'); }); }
  function tenPhan(el) {
    var s = el.closest && el.closest('.phan');
    if (s) { var t = s.querySelector('.phan-ten'); return t ? t.textContent : ''; }
    return goc && goc.closest('#hoiDs') ? 'Lời thầy trả lời' : 'Lời mở đầu';
  }
  function docTiep() {
    clearTimeout(hen);
    if (!chay) return;
    var ds = cacKhoi();
    if (khoi >= ds.length) {
      // bản đầy đủ có thể còn đang viết: chờ thêm chữ một lúc
      if (goc && goc.querySelector('.phan-cho, .dang-viet')) { $('#tdTen').textContent = 'Chờ thầy viết tiếp…'; hen = setTimeout(docTiep, 1500); return; }
      return xong();
    }
    var el = ds[khoi], cacDoan = cat(chuCua(el));
    if (doan >= cacDoan.length) { khoi++; doan = 0; return docTiep(); }
    boToSang(); el.classList.add('dang-doc');
    if (doan === 0) {
      var r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight - 150) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    $('#tdTen').textContent = tenPhan(el);
    var u = new SpeechSynthesisUtterance(cacDoan[doan]);
    u.lang = 'vi-VN'; if (giong) u.voice = giong;
    u.rate = Math.min(1.4, TOC[tocI] * 1.15); // Tăng 20% tốc độ đọc theo yêu cầu
    u.pitch = (giong && laNam(giong)) ? 0.88 : 0.52;  // Máy chỉ có giọng nữ "Google tiếng Việt" thì hạ sâu xuống 0.52 để ra giọng nam trầm uy nghi
    var lan = phien;
    u.onend = function () { if (lan !== phien) return; doan++; docTiep(); };
    u.onerror = function (e) { if (lan !== phien) return; if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; doan++; hen = setTimeout(docTiep, 200); };
    try { tts.speak(u); } catch (e) { xong(); }
  }
  // Giữ màn hình sáng khi đang đọc (máy tự tắt màn hình thì giọng đọc cũng dừng)
  var khoaMH = null;
  function giuSang(bat) {
    if (!('wakeLock' in navigator)) return;
    if (bat && !khoaMH) navigator.wakeLock.request('screen').then(function (k) { khoaMH = k; k.addEventListener('release', function () { if (khoaMH === k) khoaMH = null; }); }).catch(function () {});
    else if (!bat && khoaMH) { try { khoaMH.release(); } catch (e) {} khoaMH = null; }
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && goc && chay) giuSang(true); });
  function huyGiong() { phien++; clearTimeout(hen); try { tts.cancel(); } catch (e) {} }
  function veNut() {
    var dang = !!goc;
    giuSang(dang && chay);
    $('#thanhDoc').classList.toggle('hidden', !dang);
    $('#thanhDoc').classList.toggle('dung', !chay);
    $('#tdChay').setAttribute('aria-label', chay ? 'Tạm dừng' : 'Đọc tiếp');
    $('#tdIcon').innerHTML = chay ? '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>' : '<path d="M7 4v16l13-8z"/>';
    $('#tdTrangThai').textContent = chay ? 'Thầy đang đọc' : 'Tạm dừng';
    $('#tdTocDo').textContent = String(TOC[tocI]).replace('.', ',') + 'x';
    var laSoDang = dang && goc.id === 'reading';
    $('#btnNghe').setAttribute('aria-pressed', laSoDang ? 'true' : 'false');
    $('#btnNghe span').textContent = laSoDang ? (chay ? 'Thầy đang đọc…' : 'Đang tạm dừng') : 'Nghe thầy đọc';
    document.querySelectorAll('.nghe-tn').forEach(function (b) { b.setAttribute('aria-pressed', b === nutDang && dang ? 'true' : 'false'); });
  }
  function batDau(el, nut) {
    if (!CO) return false;
    if (giong === null || giong === undefined) giong = chonGiong();
    if (giong === null) { goiY('Máy này chưa có giọng đọc tiếng Việt. Trên Android: Cài đặt → Ngôn ngữ → Chuyển văn bản thành giọng nói → chọn Google, tải giọng Tiếng Việt. Trên iPhone: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt.'); return false; }
    huyGiong(); boToSang();
    goc = el; nutDang = nut || null; khoi = 0; doan = 0; chay = true;
    if (!cacKhoi().length) { goc = null; goiY('Thầy chưa viết xong đoạn nào, con chờ chút rồi bấm nghe nhé.'); veNut(); return false; }
    goiY('');
    veNut(); docTiep();
    return true;
  }
  function tamDung() { if (!goc) return; chay = false; huyGiong(); veNut(); }
  function docLai() { if (!goc) return; chay = true; huyGiong(); veNut(); docTiep(); }
  function xong() { huyGiong(); boToSang(); goc = null; nutDang = null; chay = false; veNut(); }
  function nhayPhan(huong) {
    if (!goc) return;
    var ds = cacKhoi(), dau = [];
    ds.forEach(function (el, i) { if (el.classList.contains('phan-dau') || i === 0) dau.push(i); });
    var moi;
    if (huong > 0) { moi = dau.filter(function (i) { return i > khoi; })[0]; if (moi === undefined) return xong(); }
    else { var truoc = dau.filter(function (i) { return i < khoi || (i === khoi && doan > 0); }); moi = truoc.length ? truoc[truoc.length - 1] : 0; if (moi === khoi && doan === 0 && truoc.length > 1) moi = truoc[truoc.length - 2]; }
    huyGiong(); khoi = moi; doan = 0; chay = true; veNut(); docTiep();
  }
  function denKhoi(el) {
    var i = cacKhoi().indexOf(el); if (i < 0) return false;
    huyGiong(); khoi = i; doan = 0; chay = true; veNut(); docTiep(); return true;
  }
  function goiY(t) { var g = $('#docGoiY'); g.textContent = t; g.classList.toggle('hidden', !t); }
  if (CO) {
    $('#btnNghe').classList.remove('hidden');
    $('#btnNghe').addEventListener('click', function () {
      if (goc && goc.id === 'reading') { chay ? tamDung() : docLai(); return; }
      batDau($('#reading'));
    });
    $('#tdChay').addEventListener('click', function () { chay ? tamDung() : docLai(); });
    $('#tdTruoc').addEventListener('click', function () { nhayPhan(-1); });
    $('#tdSau').addEventListener('click', function () { nhayPhan(1); });
    $('#tdTat').addEventListener('click', xong);
    $('#tdTocDo').addEventListener('click', function () {
      tocI = (tocI + 1) % TOC.length; ls_set('chotuvi_tocdo', tocI);
      veNut(); if (goc && chay) { huyGiong(); docTiep(); }
    });
    // Đang nghe mà chạm vào mục lục hoặc một đoạn thì thầy đọc từ chỗ đó
    document.addEventListener('click', function (e) {
      if (!goc || goc.id !== 'reading') return;
      var m = e.target.closest('#reading .muc-luc button');
      if (m) { var s = document.getElementById('phan-' + m.dataset.phan); var d = s && s.querySelector('.phan-dau'); if (d) denKhoi(d); return; }
      var k = e.target.closest('#reading p, #reading li, #reading h4, #reading .phan-dau, #reading .thang > div');
      if (k && !e.target.closest('a, button')) denKhoi(k);
    });
    window.addEventListener('pagehide', function () { huyGiong(); });
  }
  return {
    co: CO, dung: xong, batDau: batDau,
    /** Nút loa trên từng lời thầy trong khung hỏi thầy */
    nutTin: function (b) {
      if (b === nutDang && goc) { chay ? tamDung() : docLai(); return; }
      batDau(b.closest('.tn'), b);
    }
  };
})();

/* ---------- Hỏi thầy (trò chuyện, cần đặt lễ) ---------- */
var PHIEN = (function () { var p = ls_get('chotuvi_phien'); if (!p || !/^[a-z0-9]{12,40}$/i.test(p)) { p = ''; for (var i = 0; i < 24; i++) p += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36)); ls_set('chotuvi_phien', p); } return p; })();
var HOI = (function () {
  var tinNhan = [], conLai = 0, dangHoi = false, mucHoi = 20000, demoLuot = 3;
  var GOI_Y = ['Tháng này con có nên ký hợp đồng không ạ?', 'Năm nay con có nên đổi việc không?', 'Khi nào con nên mua nhà?', 'Chuyện tình cảm của con năm nay thế nào?', 'Tháng sau ngày nào đẹp để khai trương?'];
  function veAv() { var a = $('#hoiAv'); if (a && !a.firstChild) { var svg = banSaoThay(false); svg.setAttribute('viewBox', '150 165 90 90'); a.appendChild(svg); } }
  function bong(m, i) {
    if (m.vai === 'khach') return '<div class="tn khach">' + esc(m.noiDung) + '</div>';
    var chia = (!m.trong && i != null && !(dangHoi && i === tinNhan.length - 1)) ? '<button type="button" class="chia-tn" data-i="' + i + '" aria-label="Chia sẻ lời thầy trả lời">' + ICON_CHIA + '</button>' : '';
    var loa = (!m.trong && DOC.co) ? '<button type="button" class="nghe-tn" aria-label="Nghe thầy đọc câu này" aria-pressed="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg></button>' : '';
    return '<div class="tn thay' + (m.trong ? ' trong' : '') + '">' + loa + chia + '<span class="ten">Danh Sư</span>' + (m.trong ? esc(m.noiDung) : md(m.noiDung)) + '</div>';
  }
  function ve() {
    var ds = $('#hoiDs');
    var h = tinNhan.length ? tinNhan.map(function (m, i) { return bong(m, i); }).join('') : '<div class="tn thay"><span class="ten">Danh Sư</span>Lá số Quý khách đã được an định. Quý khách muốn hội đồng Danh Sư giải đoán việc gì xin cứ đặt câu hỏi, hoặc thỉnh ngày lành tháng tốt.</div>';
    ds.innerHTML = h; ds.scrollTop = ds.scrollHeight;
    var khoa = !(conLai > 0);
    $('#hoiKhoa').classList.toggle('hidden', !khoa);
    $('#hoiNhap').disabled = khoa || dangHoi; $('#hoiGui').disabled = khoa || dangHoi;
    $('#hoiNhap').placeholder = khoa ? 'Đặt lễ để hỏi thầy nhé…' : 'Con muốn hỏi thầy điều gì?';
    $('#hoiLuot').textContent = khoa ? '' : 'Con còn ' + conLai + ' câu hỏi.';
    $('#hoiGoiY').classList.toggle('hidden', khoa || tinNhan.length > 2);
  }
  async function taiLai() {
    if (!sinh || dangHoi) return;
    if (MODE !== 'server') { conLai = demoLuot; ve(); return; }
    try {
      var r = await fetch('/api/hoi-thay', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phien: PHIEN, sinh: sinh, xem: true }) });
      var j = await r.json(); if (r.ok) { tinNhan = j.tinNhan || []; conLai = j.conLai || 0; }
    } catch (e) {}
    ve();
  }
  async function hoi(cauHoi) {
    cauHoi = String(cauHoi || '').trim(); if (!cauHoi || dangHoi || !(conLai > 0)) return;
    dangHoi = true;
    tinNhan.push({ vai: 'khach', noiDung: cauHoi });
    var tl = { vai: 'thay', noiDung: 'Để thầy bấm đốt tay xem…', trong: true }; tinNhan.push(tl);
    $('#hoiNhap').value = ''; ve(); busy(true);
    try {
      if (MODE === 'server') {
        var r = await fetch('/api/hoi-thay', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phien: PHIEN, sinh: sinh, cauHoi: cauHoi }) });
        if (!r.ok) { var j = await r.json().catch(function () { return {}; }); throw new Error(j.loi || 'Thầy đang bận, con hỏi lại sau nhé.'); }
        var reader = r.body.getReader(), dec = new TextDecoder(), buf = '', chu = '', hen = null, coXong = false;
        var veHen = function () { hen = null; tl.noiDung = chu; tl.trong = false; ve(); };
        for (;;) {
          var x; try { x = await reader.read(); } catch (e) { break; }
          if (x.done) break;
          buf += dec.decode(x.value, { stream: true });
          var lines = buf.split('\n'); buf = lines.pop();
          lines.forEach(function (line) {
            if (!line.trim()) return; var o; try { o = JSON.parse(line); } catch (e) { return; }
            if (o.them) { chu += o.them; if (!hen) hen = setTimeout(veHen, 150); }
            if (o.lamLai) chu = '';
            if (o.xong) { coXong = true; clearTimeout(hen); if (o.loi) { tl.noiDung = o.loi; tl.trong = true; } else { tl.noiDung = o.text || chu; tl.trong = false; conLai = o.conLai; } }
          });
        }
        if (!coXong) {
          // mạng bị ngắt giữa chừng: máy chủ vẫn viết xong và lưu lại, lát nữa tải về câu trả lời trọn vẹn
          clearTimeout(hen);
          tl.noiDung = (chu ? chu + '…\n\n' : '') + 'Mạng chập chờn nên lời thầy bị ngắt. Đợi thầy chút, câu trả lời đầy đủ sẽ hiện lại ngay.'; tl.trong = !chu;
          setTimeout(taiLai, 8000); setTimeout(taiLai, 20000);
        }
      } else if (MODE === 'demo' && sample) {
        var lich = tinNhan.slice(0, -2).map(function (m) { return (m.vai === 'khach' ? 'Người xem: ' : 'Thầy: ') + m.noiDung; }).join('\n');
        var res = await sample(TB.promptHoiThay(laSo, '') + '\n\n' + (lich ? 'CUỘC TRÒ CHUYỆN TRƯỚC:\n' + lich + '\n\n' : '') + 'NGƯỜI XEM HỎI: ' + cauHoi, { onText: function (u) { tl.noiDung = u.text; tl.trong = false; ve(); } });
        tl.noiDung = res.text; tl.trong = false; demoLuot--; conLai = demoLuot;
      } else { tl.noiDung = 'Bản thử chưa nối máy chủ nên thầy chưa trả lời được.'; }
    } catch (e) { tl.noiDung = e.message || 'Thầy đang bận, con hỏi lại sau nhé.'; tl.trong = true; }
    finally { dangHoi = false; busy(false); ve(); }
  }
  // Đặt lễ hỏi thầy
  var MUC_HOI = [{ v: 10000, t: '4 câu' }, { v: 20000, t: '8 câu' }, { v: 50000, t: '20 câu' }];
  $('#hoiMuc').innerHTML = MUC_HOI.map(function (m) { return '<button class="amt" type="button" data-v="' + m.v + '" aria-pressed="' + (m.v === mucHoi) + '">' + money(m.v) + '<small>' + m.t + '</small></button>'; }).join('');
  $('#hoiMuc').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; mucHoi = +b.dataset.v;
    $('#hoiMuc').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  });
  $('#hoiDatLe').addEventListener('click', async function () {
    await ready; var err = $('#hoiErr'); err.textContent = '';
    var btn = this; btn.disabled = true;
    try {
      if (MODE !== 'server') { conLai = demoLuot = 3; ve(); return; }
      var r = await fetch('/api/tao-don', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sinh: sinh, chuDe: chuDe, soTien: mucHoi, loai: 'hoi', phien: PHIEN }) });
      var j = await r.json(); if (!r.ok) throw new Error(j.loi || 'Không tạo được mã chuyển khoản.');
      clearInterval(pollTimer); var qa = $('#qrArea'); if (qa) { qa.innerHTML = ''; qa.classList.add('hidden'); $('#btnPay').classList.remove('hidden'); }
      hienQR(j, $('#hoiQr'));
      batDauCho(j.id, function () { $('#hoiQr').classList.add('hidden'); $('#hoiQr').innerHTML = ''; taiLai().then(function () { say('Thầy nhận lễ rồi. Con hỏi đi, thầy nghe đây.'); $('#hoiCard').scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
      btn.classList.add('hidden');
    } catch (e) { err.textContent = e.message; } finally { btn.disabled = false; }
  });
  $('#hoiGoiY').innerHTML = GOI_Y.map(function (q) { return '<button type="button">' + esc(q) + '</button>'; }).join('');
  $('#hoiGoiY').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) hoi(b.textContent); });
  $('#hoiDs').addEventListener('click', function (e) {
    var b = e.target.closest('.nghe-tn'); if (b) { DOC.nutTin(b); return; }
    var c = e.target.closest('.chia-tn'); if (!c) return;
    var i = +c.dataset.i, m = tinNhan[i], hoiTruoc = null;
    for (var k = i - 1; k >= 0; k--) if (tinNhan[k].vai === 'khach') { hoiTruoc = tinNhan[k].noiDung; break; }
    if (!m) return;
    // chọn tối đa 3 câu hay trong lời thầy trả lời
    var cau = [];
    String(m.noiDung).replace(/\*\*/g, '').replace(/^#+\s.*$/gm, '').split(/\n+/).forEach(function (dong) {
      dong = dong.replace(/^[-*]\s+/, '').trim();
      (dong.match(/[^.!?]+[.!?]+["”]?(?=\s|$)/g) || [dong]).forEach(function (x) { x = x.trim(); if (x.length >= 30 && x.length <= 170) cau.push(x); });
    });
    var chon = cau.map(function (x, k2) { return { x: x, k: k2, d: (/\bcon\b/i.test(x) ? 2 : 0) + (/nên|hợp|tốt|thuận|ngày|tháng/i.test(x) ? 2 : 0) - (/\(|\d{4}/.test(x) ? 1 : 0) }; })
      .sort(function (a, b2) { return b2.d - a.d || a.k - b2.k; }).slice(0, 3).sort(function (a, b2) { return a.k - b2.k; }).map(function (o) { return o.x; });
    if (!chon.length) chon = [String(m.noiDung).replace(/\*\*/g, '').slice(0, 160)];
    var hoi = hoiTruoc ? (hoiTruoc.length > 70 ? hoiTruoc.slice(0, 67) + '…' : hoiTruoc) : '';
    ANH.chiaSe({ nho: 'Danh Sư luận giải', lon: laSo && laSo.ten ? laSo.ten : 'Hỏi Danh Sư', phu: hoi ? 'Hỏi: ' + hoi : 'Tuổi ' + (laSo ? laSo.canChi.nam : ''), cau: chon }, c);
  });
  $('#hoiForm').addEventListener('submit', function (e) { e.preventDefault(); hoi($('#hoiNhap').value); });
  $('#hoiNhap').addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); hoi(this.value); } });
  return {
    moi: function () { veAv(); tinNhan = []; conLai = 0; $('#hoiDatLe').classList.remove('hidden'); $('#hoiQr').classList.add('hidden'); taiLai(); },
    taiLai: taiLai
  };
})();

// Quay lại đơn đã trả (máy chủ)
ready.then(async function () {
  var saved = ls_get('chotuvi_don');
  if (MODE !== 'server' || !saved) return;
  try {
    var r = await fetch('/api/don?id=' + encodeURIComponent(saved.id)); var j = await r.json();
    if (j.trangThai !== 'da_tra') return;
    sinh = saved.sinh; chuDe = saved.chuDe; laSo = lapTuSinh(sinh); donHienTai = { id: saved.id };
    datForm(sinh); veThang(laSo); SO_LA_SO.ve();
    $('#result').classList.remove('hidden'); veLaSo(laSo); HOI.moi();
    try { window.dispatchEvent(new CustomEvent('xb_chart_generated', { detail: { chart: laSo } })); } catch(e) {}
    var cached = ls_get('chotuvi_bdd2_' + saved.id);
    if (cached) { $('#payCard').classList.add('hidden'); $('#readTitle').textContent = 'Lời thầy luận đầy đủ · ' + TB.CHU_DE[chuDe].ten; $('#reading').innerHTML = veVanBan(cached, true); }
    else moBanDayDu();
    say('Con quay lại đấy à? Bản luận của con thầy vẫn giữ đây.');
  } catch (e) {}
});

/* ---------- LỊCH ---------- */
var calY = now.getFullYear(), calM = now.getMonth() + 1, selDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
function veLich() {
  $('#calTitle').textContent = 'Tháng ' + calM + ' / ' + calY;
  var first = new Date(calY, calM - 1, 1), days = new Date(calY, calM, 0).getDate();
  var lead = (first.getDay() + 6) % 7;
  var h = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(function (d) { return '<div class="dow">' + d + '</div>'; }).join('');
  for (var i = 0; i < lead; i++) h += '<div class="cal-day out" aria-hidden="true"></div>';
  for (var d = 1; d <= days; d++) {
    var am = L.duongSangAm(d, calM, calY);
    var cc = L.canChiNgay(L.jdFromDate(d, calM, calY));
    var hd = L.ngayHoangDao(am.thang, cc.chi).tot;
    var dt = new Date(calY, calM - 1, d);
    var isToday = dt.toDateString() === now.toDateString(), isSel = dt.toDateString() === selDate.toDateString();
    var amLbl = am.ngay === 1 ? am.ngay + '/' + am.thang + (am.nhuan ? 'n' : '') : am.ngay;
    h += '<button type="button" class="cal-day' + (hd ? ' hd' : '') + (isToday ? ' today' : '') + (dt.getDay() === 0 ? ' sun' : '') + '" data-d="' + d + '" aria-pressed="' + isSel + '" aria-label="Ngày ' + d + ' tháng ' + calM + ', âm lịch ' + am.ngay + ' tháng ' + am.thang + (hd ? ', hoàng đạo' : '') + '">' +
      '<span class="d">' + d + '</span><span class="a' + (am.ngay === 1 ? ' first' : '') + '">' + amLbl + '</span></button>';
  }
  $('#cal').innerHTML = h;
}
function veChiTiet(dt) {
  var info = L.thongTinNgay(dt.getDate(), dt.getMonth() + 1, dt.getFullYear());
  var gioTot = info.gio.filter(function (g) { return g.tot; });
  $('#dayDetail').innerHTML =
    '<div style="display:flex;gap:16px;align-items:center;margin-bottom:14px"><div class="big-date">' + info.am.ngay + '</div><div><div style="font-weight:700">' + esc(info.duong.thu) + ', ' + info.duong.ngay + '/' + info.duong.thang + '/' + info.duong.nam + '</div>' +
    '<div class="muted">Âm lịch: ' + info.am.ngay + '/' + info.am.thang + (info.am.nhuan ? ' (nhuận)' : '') + ' năm ' + esc(info.canChi.nam) + '</div>' +
    '<div style="margin-top:4px"><span class="pill ' + (info.hoangDao.tot ? 'good' : 'bad') + '">' + (info.hoangDao.tot ? 'Hoàng đạo' : 'Hắc đạo') + ' · ' + esc(info.hoangDao.than) + '</span></div></div></div>' +
    '<dl class="kv"><dt>Ngày</dt><dd>' + esc(info.canChi.ngay) + ' (' + esc(info.napAmNgay) + ')</dd><dt>Tháng</dt><dd>' + esc(info.canChi.thang) + '</dd><dt>Năm</dt><dd>' + esc(info.canChi.nam) + '</dd>' +
    '<dt>Tiết khí</dt><dd>' + esc(info.tietKhi) + '</dd><dt>Trực</dt><dd>' + esc(info.truc.ten) + ' — <span style="font-weight:400">' + esc(info.truc.y) + '</span></dd>' +
    '<dt>Ngày kỵ</dt><dd>' + (info.ky.length ? esc(info.ky.join(', ')) : 'Không phạm') + '</dd><dt>Tuổi xung</dt><dd>' + esc(info.tuoiXung.join(', ')) + '</dd></dl>' +
    '<h3>Giờ hoàng đạo</h3><div class="hours">' + gioTot.map(function (g) { return '<div class="hour good"><b>' + esc(g.ten) + ' (' + g.khoang + ')</b>' + esc(g.than) + '</div>'; }).join('') + '</div>' +
    '<h3>Giờ hắc đạo</h3><div class="hours">' + info.gio.filter(function (g) { return !g.tot; }).map(function (g) { return '<div class="hour"><b>' + esc(g.ten) + ' (' + g.khoang + ')</b>' + esc(g.than) + '</div>'; }).join('') + '</div>';
}
$('#cal').addEventListener('click', function (e) {
  var b = e.target.closest('button[data-d]'); if (!b) return;
  selDate = new Date(calY, calM - 1, +b.dataset.d); veLich(); veChiTiet(selDate);
});
$('#calPrev').addEventListener('click', function () { calM--; if (calM < 1) { calM = 12; calY--; } veLich(); });
$('#calNext').addEventListener('click', function () { calM++; if (calM > 12) { calM = 1; calY++; } veLich(); });
$('#calToday').addEventListener('click', function () { calY = now.getFullYear(); calM = now.getMonth() + 1; selDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); veLich(); veChiTiet(selDate); });
veLich(); veChiTiet(selDate);

// Đổi lịch
$('#cvDuong').value = isoDate(now);
function cvD() {
  var v = $('#cvDuong').value; if (!v) return;
  var d = parseIso(v), info = L.thongTinNgay(d.getDate(), d.getMonth() + 1, d.getFullYear());
  $('#cvDuongOut').innerHTML = '<strong style="color:var(--ink)">Ngày ' + info.am.ngay + ' tháng ' + info.am.thang + (info.am.nhuan ? ' (nhuận)' : '') + ' năm ' + esc(info.canChi.nam) + '</strong><br>Ngày ' + esc(info.canChi.ngay) + ', tháng ' + esc(info.canChi.thang) + ' · ' + (info.hoangDao.tot ? 'hoàng đạo' : 'hắc đạo');
}
$('#cvDuong').addEventListener('change', cvD); cvD();
opts($('#cvAmNgay'), 1, 30, null, amNow.ngay); opts($('#cvAmThang'), 1, 12, null, amNow.thang); $('#cvAmNam').value = amNow.nam;
function cvA() {
  var n = +$('#cvAmNgay').value, t = +$('#cvAmThang').value, y = parseInt($('#cvAmNam').value, 10), nh = $('#cvAmNhuan').checked, o = $('#cvAmOut');
  if (!(y >= 1900 && y <= 2100)) { o.textContent = 'Nhập năm từ 1900 đến 2100.'; return; }
  var r = L.amSangDuong(n, t, y, nh);
  if (!r) { var ln = L.thangNhuan(y); o.textContent = nh ? ('Năm ' + y + (ln ? ' nhuận tháng ' + ln + '.' : ' không có tháng nhuận.')) : ('Tháng ' + t + ' âm năm ' + y + ' chỉ có 29 ngày.'); return; }
  var dt = new Date(r.nam, r.thang - 1, r.ngay);
  o.innerHTML = '<strong style="color:var(--ink)">' + L.THU[dt.getDay()] + ', ' + r.ngay + '/' + r.thang + '/' + r.nam + '</strong> dương lịch';
}
['#cvAmNgay', '#cvAmThang', '#cvAmNam', '#cvAmNhuan'].forEach(function (s) { $(s).addEventListener('input', cvA); $(s).addEventListener('change', cvA); }); cvA();

/* ---------- XEM NGÀY ---------- */
var viec = 'cuoihoi';
$('#viecChips').innerHTML = Object.keys(L.VIEC).map(function (k) { return '<button class="chip" type="button" data-k="' + k + '" aria-pressed="' + (k === viec) + '">' + esc(L.VIEC[k].ten) + '</button>'; }).join('');
$('#viecChips').addEventListener('click', function (e) {
  var b = e.target.closest('button'); if (!b) return; viec = b.dataset.k;
  $('#viecChips').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
});
$('#xnTu').value = isoDate(now);
/* ---------- Tử vi năm theo tuổi ---------- */
(function () {
  var amNay = L.duongSangAm(now.getDate(), now.getMonth() + 1, now.getFullYear());
  var macDinh = amNay.thang >= 9 ? amNay.nam + 1 : amNay.nam, gioi = 'nam';
  var tenNam = function (y) { return L.ten(L.canChiNam(y)); };
  $('#namXem').innerHTML = [amNay.nam, amNay.nam + 1].map(function (y) { return '<option value="' + y + '"' + (y === macDinh ? ' selected' : '') + '>' + tenNam(y) + ' ' + y + '</option>'; }).join('');
  var ns0 = TB.namSauCuaNgay(); if (ns0) $('#payNamSau').innerHTML = ', thêm phần <b>đón năm ' + esc(ns0) + '</b> từng tháng';
  var loai = 'trondoi';
  function tieuDe() {
    var y = +$('#namXem').value, vn = loai === 'vannam';
    $('#namTieuDe').textContent = vn ? 'Vận năm ' + tenNam(y) + ' ' + y : 'Tử vi trọn đời';
    $('#namGioiThieu').textContent = vn ? 'Sao chiếu mệnh, vận hạn, Tam Tai, Kim Lâu, Hoang Ốc và lời thầy dặn trong năm theo tuổi của con.' : 'Thầy luận cả một đời theo năm sinh: tính cách, tình duyên, sự nghiệp, tuổi hợp, tuổi đẹp cưới và làm nhà, hướng hợp.';
    $('#namXemWrap').classList.toggle('hidden', !vn);
    $('#btnNam').textContent = vn ? 'Nhờ thầy xem vận năm' : 'Nhờ thầy xem trọn đời';
  }
  function chonLoai(v) { loai = v === 'vannam' ? 'vannam' : 'trondoi'; $('#namLoai').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.v === loai ? 'true' : 'false'); }); tieuDe(); }
  seg('#namLoai', function (v) { chonLoai(v); });
  tieuDe(); $('#namXem').addEventListener('change', tieuDe);
  seg('#namGioi', function (v) { gioi = v; });
  function napLaSo() {
    var sv = ls_get('chotuvi_sinh'), l = null;
    try { if (sv && sv.sinh) l = lapTuSinh(sv.sinh); } catch (e) {}
    if (laSo) l = laSo;
    if (l) {
      if (!$('#namSinh').value) { $('#namSinh').value = l.am.nam; gioi = l.gioiTinh === 'Nữ' ? 'nu' : 'nam'; $('#namGioi').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.v === gioi ? 'true' : 'false'); }); }
      $('#namDungLaSoWrap').classList.remove('hidden');
      $('#namDungLaSoTen').textContent = 'Xem thêm theo lá số đã lập' + (l.ten ? ' (' + l.ten + ')' : ' (tuổi ' + l.canChi.nam + ')');
    }
    return l;
  }
  document.querySelector('nav.tabs button[data-tab="nam"]').addEventListener('click', napLaSo);
  try {
    var q = new URLSearchParams(location.search), qn = parseInt(q.get('nam'), 10);
    if (q.get('xem') === 'vannam') chonLoai('vannam');
    if (q.get('tab') === 'nam' && qn >= 1900 && qn <= 2100) {
      $('#namSinh').value = qn; if (q.get('gioi') === 'nu') { gioi = 'nu'; $('#namGioi').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.v === 'nu' ? 'true' : 'false'); }); }
      setTimeout(function () { $('#btnNam').click(); }, 60);
    }
  } catch (e) {}
  $('#btnNam').addEventListener('click', function () { try { xemNam(); } catch (e) { $('#namErr').textContent = 'Máy đang dùng bản cũ, con tải lại trang (kéo xuống để làm mới) rồi bấm lại nhé.'; } });
  function xemNam() {
    var err = $('#namErr'); err.textContent = '';
    var ns = parseInt($('#namSinh').value, 10), nx = +$('#namXem').value;
    if (!(ns >= 1900 && ns <= nx)) { err.textContent = 'Con nhập năm sinh âm lịch, ví dụ 1990.'; $('#namSinh').focus(); return; }
    var l = napLaSo();
    var dung = l && $('#namDungLaSo').checked && l.am.nam === ns ? l : null;
    if (window.DOC) DOC.dung();
    if (loai === 'trondoi') {
      var td = window.TronDoi.luan(ns, gioi), tt = tachPhan(td.text);
      $('#namOut').innerHTML = veSo(tt.parts, { chao: tt.chao, xong: true, danhGia: 'trondoi', idp: 'td-', nho: 'Danh Sư luận trọn đời', lon: 'Tuổi ' + td.canChi + ' ' + ns, meta: (gioi === 'nu' ? 'Nữ' : 'Nam') + ' mạng · mệnh ' + td.napAm + ' · cung ' + td.cungPhi });
      $('#namKqTen').textContent = 'Tử vi trọn đời';
      $('#namKq').classList.remove('hidden');
      $('#namLapLaSo').textContent = 'Lập lá số để thầy xem riêng cho con';
      var tr = $('#namTrangRieng'); tr.classList.toggle('hidden', !(ns >= 1945 && ns <= 2015)); tr.href = '/tu-vi-tron-doi/' + td.slug + '/';
      window.namDaXem = { ns: ns, gioi: gioi, nx: null, td: td };
      $('#namKq').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    $('#namTrangRieng').classList.add('hidden');
    var text = window.ThuVien.luanNamTuoi(ns, gioi, nx, dung);
    var t = tachPhan(text), sh = L.saoHan(ns, gioi, nx);
    $('#namOut').innerHTML = veSo(t.parts, { chao: t.chao, xong: true, danhGia: 'nam', idp: 'nam-', nho: 'Danh Sư xem vận năm', lon: 'Năm ' + tenNam(nx) + ' ' + nx + ' · tuổi ' + tenNam(ns), meta: (gioi === 'nu' ? 'Nữ' : 'Nam') + ' mạng · ' + sh.tuoi + ' tuổi mụ · sao ' + sh.sao.ten + (sh.han ? ' · hạn ' + sh.han.ten : '') });
    $('#namKqTen').textContent = 'Vận năm ' + tenNam(nx);
    $('#namKq').classList.remove('hidden');
    $('#namLapLaSo').textContent = dung ? 'Xem bản luận đầy đủ theo lá số' : 'Lập lá số để thầy luận kỹ năm này';
    window.namDaXem = { ns: ns, gioi: gioi, nx: nx, sh: sh };
    $('#namKq').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $('#namNghe').addEventListener('click', function () { if (window.DOC) DOC.batDau($('#namOut'), this); });
  $('#namLapLaSo').addEventListener('click', function () {
    moTab('hoi');
    if (!laSo) { var y = $('#namSinh').value; if (y) $('#fNam').value = y; }
    var dich = laSo ? ($('#payCard').classList.contains('hidden') ? $('#reading') : $('#payCard')) : $('#birthForm');
    setTimeout(function () { dich.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  });
})();

/* ---------- Xem tuổi hợp ---------- */
var HOP = (function () {
  var kieu = 'vochong', gioi = { A: 'nam', B: 'nu' }, lichKy = { A: 'duong', B: 'duong' }, mucHop = 20000, kq = null, ten = { A: '', B: '' };
  seg('#hopKieu', function (v) { kieu = v; $('#hopKyViec').textContent = v === 'laman' ? 'hợp tác, mở rộng' : 'cưới hỏi'; });
  seg('#hopAGioi', function (v) { gioi.A = v; });
  seg('#hopBGioi', function (v) { gioi.B = v; });
  ['A', 'B'].forEach(function (k) {
    seg('#hopKy' + k + 'Lich', function (v) { lichKy[k] = v; });
    opts($('#hopKy' + k + 'Ngay'), 1, 31, null, 1); opts($('#hopKy' + k + 'Thang'), 1, 12, null, 1);
    $('#hopKy' + k + 'Gio').innerHTML = '<option value="-1">Không nhớ giờ</option>' + L.CHI.map(function (c, i) { return '<option value="' + i + '">Giờ ' + c + ' (' + L.GIO_KHOANG[i] + ')</option>'; }).join('');
  });
  function datSeg(id, v) { $(id).querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.v === v ? 'true' : 'false'); }); }
  function tenGoi(k) {
    var t = $('#hop' + k + 'Ten').value.trim(); if (t) return t;
    if (kieu === 'vochong' && gioi.A !== gioi.B) return gioi[k] === 'nam' ? 'Bên nam' : 'Bên nữ';
    return k === 'A' ? 'Người thứ nhất' : 'Người thứ hai';
  }
  // Điền sẵn người thứ nhất từ lá số đã lập
  function napLaSo() {
    var sv = ls_get('chotuvi_sinh'), l = laSo, sA = sinh;
    if (!l && sv && sv.sinh) { try { l = lapTuSinh(sv.sinh); sA = sv.sinh; } catch (e) {} }
    if (!l || $('#hopANam').value) return;
    $('#hopANam').value = l.am.nam; if (l.ten) $('#hopATen').value = l.ten;
    gioi.A = l.gioiTinh === 'Nữ' ? 'nu' : 'nam'; datSeg('#hopAGioi', gioi.A);
    gioi.B = gioi.A === 'nam' ? 'nu' : 'nam'; datSeg('#hopBGioi', gioi.B);
    if (sA) { $('#hopKyANgay').value = sA.ngay; $('#hopKyAThang').value = sA.thang; $('#hopKyANam').value = sA.nam; lichKy.A = sA.lich; datSeg('#hopKyALich', sA.lich); $('#hopKyAGio').value = Math.floor(((sA.gio + 1) % 24) / 2); }
  }
  document.querySelector('nav.tabs button[data-tab="hop"]').addEventListener('click', function () { napLaSo(); hienMoLai(); });
  function veDiem(kq) {
    var p = kq.diem * 10;
    return '<div class="vong" style="--p:' + p + '"><div>' + kq.diem + '<small>/ 10</small></div></div><div><h2>' + esc(kq.muc) + '</h2><p>' + esc(ten.A) + ' (' + esc(kq.a.canChi) + ') và ' + esc(ten.B) + ' (' + esc(kq.b.canChi) + ')</p></div>';
  }
  $('#btnHop').addEventListener('click', function () {
    var err = $('#hopErr'); err.textContent = '';
    var a = parseInt($('#hopANam').value, 10), b = parseInt($('#hopBNam').value, 10);
    if (!(a >= 1900 && a <= 2100)) { err.textContent = 'Con nhập năm sinh âm lịch của người thứ nhất.'; $('#hopANam').focus(); return; }
    if (!(b >= 1900 && b <= 2100)) { err.textContent = 'Con nhập năm sinh âm lịch của người thứ hai.'; $('#hopBNam').focus(); return; }
    ten.A = tenGoi('A'); ten.B = tenGoi('B');
    kq = L.xemHop({ nam: a, gioi: gioi.A }, { nam: b, gioi: gioi.B }, kieu);
    if (window.DOC) DOC.dung();
    $('#hopDiem').innerHTML = veDiem(kq);
    var t = tachPhan(window.ThuVien.luanHop(kq, ten.A, ten.B));
    $('#hopOut').innerHTML = veSo(t.parts, { chao: t.chao, xong: true, danhGia: 'hop', idp: 'hop-', nho: kieu === 'laman' ? 'Danh Sư so tuổi làm ăn' : 'Danh Sư so tuổi vợ chồng', lon: ten.A + ' & ' + ten.B, meta: kq.a.canChi + ' · ' + kq.b.canChi });
    $('#hopHanhDong').innerHTML = '<button class="btn gold" type="button" id="hopMoKy">Nhờ thầy luận kỹ hai lá số</button><button class="btn ghost" type="button" id="hopChiaSe">' + ICON_CHIA + 'Chia sẻ</button><button class="btn ghost" type="button" id="hopNgheNhanh">Nghe thầy đọc</button>';
    window.hopKqNay = { kq: kq, A: ten.A, B: ten.B };
    $('#hopKq').classList.remove('hidden');
    $('#hopKyANhan').textContent = ten.A; $('#hopKyBNhan').textContent = ten.B;
    if (!$('#hopKyANam').value) $('#hopKyANam').value = a; if (!$('#hopKyBNam').value) $('#hopKyBNam').value = b;
    $('#hopMoKy').addEventListener('click', function () { $('#hopKy').classList.remove('hidden'); $('#hopKy').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    $('#hopNgheNhanh').addEventListener('click', function () { if (window.DOC) DOC.batDau($('#hopOut'), this); });
    $('#hopKq').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  // Lễ luận kỹ
  $('#hopMuc').innerHTML = MUC.map(function (m) { return '<button class="amt" type="button" data-v="' + m.v + '" aria-pressed="' + (m.v === mucHop) + '">' + money(m.v) + '<small>' + m.t + '</small></button>'; }).join('');
  $('#hopMuc').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; mucHop = +b.dataset.v;
    $('#hopMuc').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
  });
  function docSinh(k) {
    var nam = parseInt($('#hopKy' + k + 'Nam').value, 10), ngay = +$('#hopKy' + k + 'Ngay').value, thang = +$('#hopKy' + k + 'Thang').value, g = +$('#hopKy' + k + 'Gio').value;
    var nhan = k === 'A' ? ten.A : ten.B;
    if (!(nam >= 1900 && nam <= 2100)) throw new Error('Năm sinh của ' + nhan + ' chưa đúng.');
    if (lichKy[k] === 'duong') { var d = new Date(nam, thang - 1, ngay); if (d.getMonth() !== thang - 1) throw new Error('Ngày sinh của ' + nhan + ' không có trên lịch.'); }
    else if (!L.amSangDuong(ngay, thang, nam, false)) throw new Error('Ngày âm của ' + nhan + ' không có trên lịch.');
    var s = { lich: lichKy[k], ngay: ngay, thang: thang, nam: nam, nhuan: false, gio: (g < 0 ? 6 : g) * 2, gioiTinh: gioi[k], ten: (k === 'A' ? ten.A : ten.B).slice(0, 60) };
    if (k === 'A' && sinh && sinh.hoanCanh && sinh.nam === nam && sinh.ngay === ngay && sinh.thang === thang) s.hoanCanh = sinh.hoanCanh;
    return { s: s, khongRoGio: g < 0 };
  }
  $('#hopDatLe').addEventListener('click', async function () {
    await ready; var err = $('#hopKyErr'); err.textContent = '';
    var min = (CFG && CFG.minAmount) || 10000;
    if (mucHop < min) { err.textContent = 'Lễ tối thiểu ' + money(min) + ' con nhé.'; return; }
    var A, B; try { A = docSinh('A'); B = docSinh('B'); } catch (e) { err.textContent = e.message; return; }
    if (MODE !== 'server') { err.textContent = 'Bản thử chưa nối máy chủ thanh toán.'; return; }
    var btn = this; btn.disabled = true;
    try {
      var r = await fetch('/api/tao-don', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ loai: 'hop', sinh: A.s, sinhB: B.s, kieu: kieu, khongRoGio: { a: A.khongRoGio, b: B.khongRoGio }, soTien: mucHop, phien: PHIEN }) });
      var j = await r.json(); if (!r.ok) throw new Error(j.loi || 'Không tạo được mã chuyển khoản.');
      ls_set('chotuvi_hop', { id: j.id, tenA: ten.A, tenB: ten.B, kieu: kieu });
      hienQR(j, $('#hopQr')); batDauCho(j.id, function () { moKy(j.id); });
      btn.classList.add('hidden');
    } catch (e) { err.textContent = e.message; } finally { btn.disabled = false; }
  });
  async function moKy(id) {
    var luu = ls_get('chotuvi_hop') || {}, out = $('#hopKyOut');
    $('#hopQr').classList.add('hidden'); $('#hopKy').classList.add('hidden');
    $('#hopKyKq').classList.remove('hidden');
    var tieuDe = { nho: 'Lá sớ Danh Sư luận hợp tuổi', lon: (luu.tenA || 'Hai con') + ' & ' + (luu.tenB || ''), idp: 'hopky-' };
    var ve = function (text, xong) { var t = tachPhan(text); out.innerHTML = t.parts.length ? veSo(t.parts, Object.assign({ chao: t.chao, xong: xong, danhGia: xong ? 'hopky' : null }, tieuDe)) : md(text); };
    var daLuu = ls_get('chotuvi_hopbl_' + id);
    if (daLuu) { ve(daLuu, true); return; }
    out.innerHTML = '<p class="muted"><span class="spinner" style="vertical-align:-3px;margin-right:8px"></span>Thầy đang lập hai lá số, so từng cung…</p>';
    $('#hopKyKq').scrollIntoView({ behavior: 'smooth', block: 'start' });
    busy(true);
    try {
      for (var lan = 0; lan < 6; lan++) {
        var r = await fetch('/api/luan-hop', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ don: id }) });
        if (!r.ok) { var j = await r.json().catch(function () { return {}; }); throw new Error(j.loi || 'Thầy đang bận.'); }
        var reader = r.body.getReader(), dec = new TextDecoder(), buf = '', chu = '', ketQua = null, hen = null;
        for (;;) {
          var x; try { x = await reader.read(); } catch (e) { break; }
          if (x.done) break;
          buf += dec.decode(x.value, { stream: true });
          var lines = buf.split('\n'); buf = lines.pop();
          lines.forEach(function (line) {
            if (!line.trim()) return; var o; try { o = JSON.parse(line); } catch (e) { return; }
            if (o.them) { chu += o.them; if (!hen) hen = setTimeout(function () { hen = null; ve(chu, false); }, 250); }
            if (o.lamLai) chu = '';
            if (o.xong) ketQua = o;
          });
        }
        clearTimeout(hen);
        if (ketQua && ketQua.text) { ls_set('chotuvi_hopbl_' + id, ketQua.text); ve(ketQua.text, true); say('Thầy so xong rồi. Hai đứa đọc kỹ lời thầy dặn nhé.'); return; }
        if (ketQua && ketQua.loi) throw new Error(ketQua.loi);
        await cho(ketQua && ketQua.dangViet ? 6000 : 2000);
      }
      throw new Error('Thầy viết chưa xong, con tải lại trang sau ít phút nhé.');
    } catch (e) {
      out.innerHTML = '<p class="err">' + esc(e.message) + '</p><button class="btn gold" type="button" id="hopLai">Nhờ thầy luận lại</button>';
      $('#hopLai').addEventListener('click', function () { moKy(id); });
    } finally { busy(false); }
  }
  $('#hopNghe').addEventListener('click', function () { if (window.DOC) DOC.batDau($('#hopKyOut'), this); });
  function hienMoLai() {
    var luu = ls_get('chotuvi_hop'); if (!luu || !luu.id) return;
    var b = $('#hopMoLai'); b.textContent = 'Xem lại bản luận kỹ: ' + (luu.tenA || '') + ' & ' + (luu.tenB || '');
    b.classList.remove('hidden');
    b.onclick = async function () {
      if (ls_get('chotuvi_hopbl_' + luu.id)) return moKy(luu.id);
      try { var j = await (await fetch('/api/don?id=' + encodeURIComponent(luu.id))).json(); if (j.trangThai === 'da_tra') return moKy(luu.id); } catch (e) {}
      $('#hopErr').textContent = 'Thầy chưa nhận được lễ của đơn ' + luu.id + '.';
    };
  }
  return { moKy: moKy };
})();

/* ---------- Ảnh "Lời thầy phán" để chia sẻ ---------- */
var ANH = window.ANH = (function () {
  /** Lấy câu nổi bật: câu đầu của các đoạn ở các phần khác nhau, ưu tiên câu nói về "con", độ dài vừa phải */
  function chonCau(goc, max) {
    var ds = [], daLay = {};
    goc.querySelectorAll('.phan').forEach(function (ph, i) {
      if (/Bản đầy đủ|Muốn thầy xem/.test(ph.textContent.slice(0, 60))) return;
      ph.querySelectorAll('p:not(.dang-viet):not(.err), li').forEach(function (el) {
        var t = el.textContent.replace(/\s+/g, ' ').trim().replace(/^Thầy nói chuyện đời thường cho dễ hình dung:\s*/, '');
        (t.match(/[^.!?]+[.!?]+["”]?(?=\s|$)/g) || [t]).forEach(function (c, k) {
          c = c.trim(); if (c.length < 35 || c.length > 170) return;
          c = c.charAt(0).toUpperCase() + c.slice(1);
          var d = (/\bcon\b/i.test(c) ? 3 : 0) + (k === 0 ? 1 : 0)
            + (/^(Cung|Con tuổi|Năm |Cát tinh|Lại có|Con đang đi|Sang năm|Bấy nhiêu)/.test(c) ? -5 : 0)
            + (/\(|\d{4}|\d+\/\d+/.test(c) ? -5 : 0)
            + (/xấu|tiểu nhân|hãm|khắc|trắc trở|hao|thị phi|kiện|bệnh|mất/.test(c) ? -4 : 0)
            + (/nên|hợp|giữ|thuận|sáng|quý nhân|người ta|thương|lộc/.test(c) ? 2 : 0);
          ds.push({ c: c, d: d, phan: i });
        });
      });
    });
    ds.sort(function (a, b) { return b.d - a.d || a.phan - b.phan; });
    var out = [];
    ds.forEach(function (x) { if (out.length < (max || 3) && !daLay[x.phan] && x.d > 0) { daLay[x.phan] = 1; out.push(x); } });
    return out.sort(function (a, b) { return a.phan - b.phan; }).map(function (x) { return x.c; });
  }
  /** Nhãn ngắn cho từng phần của bài luận */
  function nhanNgan(t) {
    t = String(t || '').trim();
    var M = [[/^(Con người|Mệnh cách)/i, 'Con người'], [/^Cách cục/i, 'Thế lá số'], [/^Tình duyên/i, 'Tình duyên'], [/^Tiền/i, 'Tiền tài'], [/^Công danh/i, 'Công danh'],
      [/^Gia đạo/i, 'Gia đạo'], [/^Các đại vận|^Các giai đoạn/i, 'Đường đời'], [/^Vận năm (.+)/i, 'Năm $1'], [/^Đón năm (.+)/i, 'Năm $1'], [/dặn/i, 'Thầy dặn'],
      [/^Tổng quan tuổi/i, 'Tổng quan'], [/^Tính cách/i, 'Tính cách'], [/^Sự nghiệp/i, 'Sự nghiệp'], [/^Hướng/i, 'Hướng hợp'], [/^Sao chiếu mệnh/i, 'Sao chiếu mệnh'],
      [/^Vận hạn/i, 'Vận hạn'], [/^Làm nhà/i, 'Làm nhà, cưới hỏi'], [/^Theo lá số/i, 'Theo lá số'], [/^Hai người là ai/i, 'Hai người'], [/^Hợp nhau/i, 'Chỗ hợp'],
      [/^Dễ va nhau/i, 'Chỗ cần nhường'], [/^Chuyện chung nhà|^Chia vai/i, 'Chung nhà'], [/^Thời điểm/i, 'Thời điểm thuận'], [/^Tuổi .* gặp năm/i, 'Tuổi gặp năm']];
    for (var i = 0; i < M.length; i++) if (M[i][0].test(t)) return t.replace(/^.*$/, function (a) { var m = a.match(M[i][0]); return M[i][1].replace('$1', m && m[1] ? m[1].replace(/\s*\d{4}$/, '') : ''); });
    return t.replace(/\s*[:·(].*$/, '').slice(0, 24);
  }
  function diemCau(c) {
    return (/Đức năng thắng số|hạn chế|nên tránh|thuộc (Đông|Tây) tứ mệnh/.test(c) ? -5 : 0) + (/Hình tượng|nhắm vào|tháng|Thầy coi/.test(c) ? 2 : 0) + (/^Con đang đi đại vận/.test(c) ? -2 : 0) + (/\bcon\b/i.test(c) ? 3 : 0) + (/^(Cung|Con tuổi|Cát tinh|Lại có|Bấy nhiêu|Năm sinh)/.test(c) ? -5 : 0) + (/\(|\d+\/\d+/.test(c) ? -3 : 0)
      + (/xấu|tiểu nhân|hãm|trắc trở|hao|thị phi|kiện|bệnh|mất/.test(c) ? -3 : 0) + (/nên|hợp|giữ|thuận|sáng|quý nhân|người ta|thương|lộc|vượng|tốt/.test(c) ? 2 : 0);
  }
  function cauHay(text, max) {
    var ds = [];
    (String(text).replace(/\s*\([^)]*\)/g, '').replace(/Thầy nói chuyện đời thường cho dễ hình dung:\s*|Nói chuyện đời thường cho dễ hình dung:\s*/g, '').replace(/\s+/g, ' ').trim().match(/[^.!?;]+[.!?;]+["”]?(?=\s|$)/g) || [text]).forEach(function (c, k) {
      c = c.trim().replace(/[;]$/, '.'); if (c.length < 25) return;
      if (c.length > (max || 130)) { var cat = c.lastIndexOf(',', max || 130); if (cat < 40) return; c = c.slice(0, cat) + '.'; }
      ds.push({ c: c.charAt(0).toUpperCase() + c.slice(1), d: diemCau(c) - k * 0.1 });
    });
    ds.sort(function (a, b) { return b.d - a.d; });
    return ds.length ? ds[0].c : '';
  }
  /** Tóm tắt bài luận: mỗi phần một ý chính (tối đa max mục) */
  function tomTat(goc, max) {
    var out = [], daCo = {};
    function them(nhan, cau) { if (!cau || daCo[nhan]) return; daCo[nhan] = 1; out.push({ nhan: nhan, cau: cau, uu: /^Con người|^Tổng quan$|^Tuổi gặp/.test(nhan) ? 10 : /^Năm|^Sao chiếu|^Hai người/.test(nhan) ? 9 : /Tình duyên|Tiền tài|Công danh|Sự nghiệp|Tính cách|Chỗ hợp/.test(nhan) ? 8 : /dặn/.test(nhan) ? 7 : 4 }); }
    goc.querySelectorAll('.phan').forEach(function (ph) {
      var ten = (ph.querySelector('.phan-ten') || {}).textContent || '';
      if (/Bản đầy đủ|Muốn thầy xem|Xem thêm/.test(ten)) return;
      if (/Các mặt khác/.test(ten)) {
        ph.querySelectorAll('li').forEach(function (li) { var b = li.querySelector('strong'); if (!b) return; them(nhanNgan(b.textContent), cauHay(li.textContent.replace(/^[^:]*:\s*/, ''), 120)); });
        return;
      }
      var nhan = nhanNgan(ten);
      if (nhan === 'Hướng hợp') { var h = [].map.call(ph.querySelectorAll('li strong'), function (e) { return e.textContent; }); if (h.length) them(nhan, 'Hướng tốt: ' + h.join(', ') + '.'); return; }
      var chu = [].map.call(ph.querySelectorAll('p:not(.dang-viet):not(.err), li, .thang > div'), function (e) {
        var t = e.textContent, b = e.firstElementChild;
        if (e.tagName === 'LI' && b && b.tagName === 'STRONG' && t.indexOf(b.textContent) === 0) t = t.slice(b.textContent.length).replace(/^[^:]{0,40}:\s*/, '');
        return /[.!?]$/.test(t.trim()) ? t : t + '.';
      }).join(' ');
      them(nhan, cauHay(chu, 130));
    });
    var giu = out.map(function (x, i) { return { x: x, i: i }; }).sort(function (a, b) { return b.x.uu - a.x.uu || a.i - b.i; }).slice(0, max || 6).sort(function (a, b) { return (/dặn/.test(a.x.nhan) ? 1 : 0) - (/dặn/.test(b.x.nhan) ? 1 : 0) || a.i - b.i; }); // lời dặn để cuối
    return giu.map(function (o) { return { nhan: o.x.nhan, cau: o.x.cau }; });
  }
  function bocChu(ctx, text, w) {
    var tu = text.split(' '), dong = [], cur = '';
    tu.forEach(function (t) { var thu = cur ? cur + ' ' + t : t; if (ctx.measureText(thu).width > w && cur) { dong.push(cur); cur = t; } else cur = thu; });
    if (cur) dong.push(cur); return dong;
  }
  async function anhThay() {
    try {
      var svg = banSaoThay(false); svg.setAttribute('viewBox', '120 150 150 150'); svg.setAttribute('width', '300'); svg.setAttribute('height', '300');
      var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
      var img = new Image(); img.src = url; await img.decode(); return img;
    } catch (e) { return null; }
  }
  /** o: { nho, lon, phu, cau: [..], y?: [{nhan, cau}] tóm tắt từng phần, diem? } → Blob PNG rộng 1080 */
  async function ve(o) {
    try { await document.fonts.ready; } catch (e) {}
    var W = 1080, H = 1350, px = 90, top = 510;
    // Chế độ tóm tắt: danh sách {nhan, cau}, ảnh cao dần theo nội dung (tối đa 1920)
    var ds = o.y && o.y.length ? o.y.slice(0, 7) : null, fsY = 36, khoiY = null, caoY = 0;
    if (ds) {
      var m = document.createElement('canvas').getContext('2d');
      for (;;) {
        m.font = '400 ' + fsY + 'px "Noto Serif", serif';
        khoiY = ds.map(function (it) { return bocChu(m, it.cau, W - 2 * px - 80); });
        caoY = khoiY.reduce(function (t, d) { return t + 44 + d.length * fsY * 1.4 + 26; }, 0);
        if (top + 50 + caoY + 40 + 210 <= 1920 || fsY <= 26) break; fsY -= 2;
      }
      H = Math.max(1350, Math.min(1920, Math.ceil(top + 50 + caoY + 40 + 210)));
    }
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d1729'); g.addColorStop(1, '#2e231c'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#f2c76b'; x.lineWidth = 4; x.strokeRect(28, 28, W - 56, H - 56); x.lineWidth = 1.5; x.strokeRect(42, 42, W - 84, H - 84);
    var img = await anhThay();
    if (img) { x.save(); x.beginPath(); x.arc(W / 2, 175, 105, 0, Math.PI * 2); x.closePath(); x.fillStyle = '#2b2240'; x.fill(); x.clip(); x.drawImage(img, W / 2 - 105, 70, 210, 210); x.restore(); x.strokeStyle = '#f2c76b'; x.lineWidth = 5; x.beginPath(); x.arc(W / 2, 175, 105, 0, Math.PI * 2); x.stroke(); }
    x.textAlign = 'center'; x.fillStyle = '#f2c76b'; x.font = '600 30px "Be Vietnam Pro", sans-serif';
    x.fillText((o.nho || 'DANH SƯ BÌNH GIẢI').toUpperCase().split('').join(String.fromCharCode(8202)), W / 2, 330);
    x.fillStyle = '#fff7e6'; var co = 64; x.font = '700 ' + co + 'px "Noto Serif", serif';
    while (x.measureText(o.lon).width > W - 160 && co > 40) { co -= 4; x.font = '700 ' + co + 'px "Noto Serif", serif'; }
    x.fillText(o.lon, W / 2, 410);
    if (o.phu) { x.fillStyle = '#c9b896'; x.font = '400 30px "Be Vietnam Pro", sans-serif'; x.fillText(o.phu, W / 2, 460); }
    // tờ giấy
    var bot = H - 210;
    x.fillStyle = '#f3e6c8'; x.beginPath(); if (x.roundRect) x.roundRect(px, top, W - 2 * px, bot - top, 28); else x.rect(px, top, W - 2 * px, bot - top); x.fill();
    if (ds) {
      var yy = top + 50 + Math.max(0, (bot - top - 90 - caoY) / 2);
      x.textAlign = 'left';
      ds.forEach(function (it, i) {
        x.fillStyle = '#b3361f'; x.font = '700 26px "Be Vietnam Pro", sans-serif';
        x.fillText('◆  ' + it.nhan.toUpperCase(), px + 40, yy + 26); yy += 44;
        x.fillStyle = '#2a1d14'; x.font = '400 ' + fsY + 'px "Noto Serif", serif';
        khoiY[i].forEach(function (d) { yy += fsY * 1.05; x.fillText(d, px + 40, yy); yy += fsY * 0.35; });
        yy += 26;
        if (i < ds.length - 1) { x.strokeStyle = 'rgba(179,54,31,.18)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(px + 40, yy - 13); x.lineTo(W - px - 40, yy - 13); x.stroke(); }
      });
      o.cau = [];
    }
    var cau = (o.cau || []).slice(0, 3), fs = 40, khoi;
    for (;;) {
      x.font = '400 ' + fs + 'px "Noto Serif", serif';
      khoi = cau.map(function (t) { return bocChu(x, t, W - 2 * px - 130); });
      var cao = khoi.reduce(function (t, d) { return t + d.length * fs * 1.45; }, 0) + (cau.length - 1) * 34;
      if (cao <= bot - top - 90 || fs <= 28) break; fs -= 2;
    }
    var y = top + 70 + Math.max(0, (bot - top - 90 - cao) / 2);
    x.textAlign = 'left';
    khoi.forEach(function (dong) {
      x.fillStyle = '#b3361f'; x.font = '700 64px "Noto Serif", serif'; x.fillText('“', px + 34, y + 30);
      x.fillStyle = '#2a1d14'; x.font = '400 ' + fs + 'px "Noto Serif", serif';
      dong.forEach(function (d) { x.fillText(d, px + 92, y); y += fs * 1.45; });
      y += 34;
    });
    if (o.diem != null) { x.textAlign = 'right'; x.fillStyle = '#b3361f'; x.font = '700 54px "Noto Serif", serif'; x.fillText(o.diem + '/10', W - px - 30, top + 66); }
    // ấn đỏ + chân trang
    x.save(); x.translate(160, H - 120); x.rotate(-0.08); x.fillStyle = '#b3361f'; x.fillRect(-62, -62, 124, 124); x.strokeStyle = '#f3e6c8'; x.lineWidth = 3; x.strokeRect(-52, -52, 104, 104);
    x.fillStyle = '#f3e6c8'; x.textAlign = 'center'; x.font = '700 28px "Noto Serif", serif'; x.fillText('DANH', 0, -6); x.fillText('SƯ', 0, 32); x.restore();
    x.textAlign = 'left'; x.fillStyle = '#f2c76b'; x.font = '700 40px "Noto Serif", serif'; x.fillText('www.xemboi.vn', 250, H - 128);
    x.fillStyle = '#c9b896'; x.font = '400 28px "Be Vietnam Pro", sans-serif'; x.fillText('Lập lá số, xem tuổi, xem ngày miễn phí', 250, H - 84);
    return await new Promise(function (r) { c.toBlob(r, 'image/png'); });
  }
  var anhNay = null, urlNay = null;
  function hop() {
    var d = $('#anhSheet');
    if (d) return d;
    d = document.createElement('dialog'); d.className = 'sheet anh-sheet'; d.id = 'anhSheet'; d.setAttribute('aria-label', 'Ảnh lời Danh Sư luận giải');
    d.innerHTML = '<div class="anh-dau"><b>Ảnh lời Danh Sư luận giải</b><button type="button" class="anh-dong" aria-label="Đóng">×</button></div>' +
      '<div class="anh-khung"><img id="anhXem" alt="Ảnh lời Danh Sư luận giải"></div>' +
      '<p class="anh-goi-y" id="anhGoiY"></p>' +
      '<div class="anh-nut"><button type="button" class="btn gold" id="anhChia">' + ICON_CHIA + 'Chia sẻ</button><button type="button" class="btn ghost" id="anhLuu">Lưu ảnh</button></div>';
    document.body.appendChild(d);
    d.querySelector('.anh-dong').addEventListener('click', function () { d.close(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    $('#anhChia').addEventListener('click', async function () {
      if (!anhNay) return;
      var file = new File([anhNay], 'loi-thay-ba-chotuvi.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // chỉ gửi tệp ảnh (không kèm chữ) để app nhận đúng là ảnh
        try { await navigator.share({ files: [file] }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
      }
      taiVe();
    });
    $('#anhLuu').addEventListener('click', taiVe);
    return d;
  }
  function taiVe() {
    if (!urlNay) return;
    var a = document.createElement('a'); a.href = urlNay; a.download = 'loi-thay-ba-chotuvi.png'; document.body.appendChild(a); a.click(); a.remove();
  }
  async function chiaSe(o, nut) {
    var cu = nut ? nut.innerHTML : '';
    if (nut) { nut.disabled = true; if (!nut.classList.contains('chia-tn')) nut.textContent = 'Thầy đang viết ảnh…'; }
    try {
      anhNay = await ve(o);
      if (urlNay) URL.revokeObjectURL(urlNay);
      urlNay = URL.createObjectURL(anhNay);
      var d = hop();
      $('#anhXem').src = urlNay;
      var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      $('#anhGoiY').textContent = ios ? 'Bấm Chia sẻ để gửi Zalo, Facebook. Muốn lưu vào Ảnh: chạm giữ vào ảnh rồi chọn "Lưu vào Ảnh", hoặc bấm Chia sẻ rồi chọn "Lưu hình ảnh".' : 'Bấm Chia sẻ để gửi Zalo, Facebook, hoặc Lưu ảnh để cất vào máy.';
      $('#anhLuu').classList.toggle('hidden', ios);
      if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    } finally { if (nut) { nut.disabled = false; nut.innerHTML = cu; } }
  }
  return { chonCau: chonCau, tomTat: tomTat, ve: ve, chiaSe: chiaSe };
})();
var ICON_CHIA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';

['#btnChiaSe', '#namChiaSe', '#hopKyChiaSe'].forEach(function (id) { $(id).innerHTML = ICON_CHIA + 'Chia sẻ bài luận'; });
$('#btnChiaSeTren').innerHTML = ICON_CHIA + '<span>Chia sẻ</span>';
$('#btnChiaSeTren').addEventListener('click', function () { $('#btnChiaSe').click(); });
// Nút chia sẻ hiện bất cứ khi nào bài luận đã có nội dung (bản miễn phí, bản đầy đủ, bản mở lại từ máy)
(function () {
  var capNhat = function () { var co = !!document.querySelector('#reading .phan p, #reading .phan li'); $('#docHanhDong').classList.toggle('hidden', !co); $('#btnChiaSeTren').classList.toggle('hidden', !co); };
  new MutationObserver(function () { clearTimeout(capNhat.h); capNhat.h = setTimeout(capNhat, 200); }).observe($('#reading'), { childList: true, subtree: true });
  capNhat();
})();
$('#btnChiaSe').addEventListener('click', function () {
  if (!laSo) return;
  var dayDu = /đầy đủ/.test($('#readTitle').textContent);
  ANH.chiaSe({ nho: dayDu ? 'Lá sớ Danh Sư luận kỹ' : 'Danh Sư luận giải cho', lon: laSo.ten || 'Tuổi ' + laSo.canChi.nam, phu: 'Tuổi ' + laSo.canChi.nam + ' · ' + laSo.banMenh + ' · ' + TB.CHU_DE[chuDe].ten, y: ANH.tomTat($('#reading'), 7), cau: ANH.chonCau($('#reading')) }, this);
});
$('#namChiaSe').addEventListener('click', function () {
  var d = window.namDaXem; if (!d) return;
  var tn = L.ten(L.canChiNam(d.ns));
  if (d.td) { ANH.chiaSe({ nho: 'Danh Sư luận trọn đời', lon: 'Tuổi ' + tn + ' ' + d.ns, phu: (d.gioi === 'nu' ? 'Nữ' : 'Nam') + ' mạng · ' + d.td.napAm, y: ANH.tomTat($('#namOut'), 6), cau: ANH.chonCau($('#namOut')) }, this); return; }
  ANH.chiaSe({ nho: 'Danh Sư xem vận năm ' + d.nx, lon: 'Tuổi ' + tn + ' năm ' + L.ten(L.canChiNam(d.nx)), phu: 'Sao ' + d.sh.sao.ten + (d.sh.han ? ' · hạn ' + d.sh.han.ten : '') + ' · ' + d.sh.tuoi + ' tuổi', y: ANH.tomTat($('#namOut'), 6), cau: ANH.chonCau($('#namOut')) }, this);
});
$('#hopKyChiaSe').addEventListener('click', function () {
  var luu = ls_get('chotuvi_hop') || {};
  ANH.chiaSe({ nho: 'Danh Sư luận hợp tuổi', lon: (luu.tenA || '') + ' & ' + (luu.tenB || ''), y: ANH.tomTat($('#hopKyOut'), 6), cau: ANH.chonCau($('#hopKyOut')) }, this);
});
document.addEventListener('click', function (e) {
  var b = e.target.closest('#hopChiaSe'); if (!b || !window.hopKqNay) return;
  var k = window.hopKqNay;
  ANH.chiaSe({ nho: k.kq.kieu === 'laman' ? 'Danh Sư so tuổi làm ăn' : 'Danh Sư so tuổi vợ chồng', lon: k.A + ' & ' + k.B, phu: k.kq.a.canChi + ' · ' + k.kq.b.canChi + ' · ' + k.kq.muc, diem: k.kq.diem, cau: ANH.chonCau($('#hopOut')) }, b);
});

/* ---------- Sổ lá số cả nhà + lời thầy dặn tháng này ---------- */
function khoaSo(x) { return [x.lich, x.ngay, x.thang, x.nam, x.nhuan ? 1 : 0, Math.floor(((x.gio + 1) % 24) / 2), x.gioiTinh].join('-'); }
var SO_LA_SO = (function () {
  function ds() { var d = ls_get('chotuvi_so'); return Array.isArray(d) ? d : []; }
  function luu(x) {
    var d = ds().filter(function (y) { return khoaSo(y.sinh) !== khoaSo(x); });
    d.unshift({ sinh: x, luc: Date.now() }); ls_set('chotuvi_so', d.slice(0, 12)); ve();
  }
  function ve() {
    var d = ds(), hop = $('#sls');
    if (!d.length) { hop.classList.add('hidden'); return; }
    hop.classList.remove('hidden');
    var nay = sinh ? khoaSo(sinh) : '';
    $('#slsDs').innerHTML = d.map(function (y, i) {
      var cc = ''; try { cc = L.ten(L.canChiNam(lapTuSinh(y.sinh).am.nam)); } catch (e) {}
      var ten = y.sinh.ten || (y.sinh.gioiTinh === 'nu' ? 'Nữ' : 'Nam') + ' ' + y.sinh.nam;
      return '<span class="sls-chip"' + (khoaSo(y.sinh) === nay ? ' aria-current="true"' : '') + '><button type="button" class="mo" data-i="' + i + '">' + esc(ten) + '<small>' + esc(cc) + '</small></button><button type="button" class="xoa" data-xoa="' + i + '" aria-label="Xóa lá số ' + esc(ten) + ' khỏi máy">×</button></span>';
    }).join('') + '<button type="button" class="sls-moi" id="slsMoi">+ Người khác</button>';
  }
  $('#slsDs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var d = ds();
    if (b.id === 'slsMoi') { datForm(null); $('#birthForm').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('#birthForm').ten.focus(); return; }
    if (b.dataset.xoa != null) { d.splice(+b.dataset.xoa, 1); ls_set('chotuvi_so', d); ve(); return; }
    var y = d[+b.dataset.i]; if (!y) return;
    datForm(y.sinh); $('#birthForm').requestSubmit ? $('#birthForm').requestSubmit() : $('#btnXem').click();
  });
  return { luu: luu, ve: ve };
})();
/** Điền form ngày sinh từ dữ liệu đã lưu (null = để trống cho người mới) */
function datForm(x) {
  var f = $('#birthForm');
  x = x || { lich: 'duong', ngay: 1, thang: 1, nam: '', nhuan: false, gio: 12, gioiTinh: 'nam', ten: '' };
  f.ten.value = x.ten || '';
  gender = x.gioiTinh === 'nu' ? 'nu' : 'nam'; $('#segGender').querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === gender ? 'true' : 'false'); });
  calType = x.lich === 'am' ? 'am' : 'duong'; $('#segCal').querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === calType ? 'true' : 'false'); });
  $('#leapWrap').classList.toggle('hidden', calType !== 'am');
  opts($('#fNgay'), 1, calType === 'am' ? 30 : 31, null, x.ngay); $('#fThang').value = x.thang; $('#fNam').value = x.nam; f.nhuan.checked = !!x.nhuan;
  $('#fGio').value = Math.floor(((x.gio + 1) % 24) / 2);
  datHoanCanh(x.hoanCanh);
}
function veThang(l) {
  var c = $('#thangCard'); if (!l) { c.classList.add('hidden'); return; }
  try {
    var r = window.ThuVien.luanThang(l, now);
    c.innerHTML = '<div class="nhan">Lời Danh Sư định hướng ' + esc(l.ten || 'tuổi ' + l.canChi.nam) + '</div><h2>' + esc(r.tieuDe) + '</h2>' + md(r.text) +
      '<p style="margin:8px 0"><a class="lk-hn" href="/tu-vi-hom-nay/tuoi-' + window.HomNay.SLUG[L.canChiNam(l.am.nam).chi] + '">Tử vi hôm nay của tuổi ' + esc(L.CHI[L.canChiNam(l.am.nam).chi]) + ' ›</a></p>' +
      (r.ngayTot.length ? '<div class="small muted" style="font-weight:600">Ngày tốt còn lại trong tháng (hợp tuổi con):</div><div class="ngay-tot">' + r.ngayTot.map(function (n) { return '<span>' + esc(n.thu) + ' ' + n.d + '/' + n.m + '<small>' + n.am + ' âm</small></span>'; }).join('') + '</div>' : '');
    c.classList.remove('hidden');
  } catch (e) { c.classList.add('hidden'); }
}
/** Lá số này đã từng gửi lễ bản đầy đủ: mở lại luôn */
function luuDonTheoLaSo(id) { var m = ls_get('chotuvi_dons') || {}; m[khoaSo(sinh)] = { id: id, chuDe: chuDe }; ls_set('chotuvi_dons', m); }
async function moLaiDonCu() {
  var m = ls_get('chotuvi_dons') || {}, d = sinh && m[khoaSo(sinh)];
  if (!d || MODE !== 'server') return false;
  try {
    var j = await (await fetch('/api/don?id=' + encodeURIComponent(d.id))).json();
    if (j.trangThai !== 'da_tra') return false;
    donHienTai = { id: d.id };
    var cached = ls_get('chotuvi_bdd2_' + d.id);
    if (cached) { $('#payCard').classList.add('hidden'); $('#readTitle').textContent = 'Lời thầy luận đầy đủ · ' + TB.CHU_DE[d.chuDe || chuDe].ten; $('#reading').innerHTML = veVanBan(cached, true); $('#docHanhDong').classList.remove('hidden'); }
    else moBanDayDu();
    return true;
  } catch (e) { return false; }
}
SO_LA_SO.ve();
(function () { var sv = ls_get('chotuvi_sinh'); if (sv && sv.sinh && !laSo) { try { datForm(sv.sinh); veThang(lapTuSinh(sv.sinh)); } catch (e) {} } })();

/* ---------- Thẻ Tử vi hôm nay (trang chủ) ---------- */
function veHomNay() {
  try {
    var H = window.HomNay;
    var Lich = window.Lich || L;
    if (!H || !Lich) {
      setTimeout(veHomNay, 60);
      return;
    }
    var card = $('#hnCard');
    if (!card) return;
    var v = H.ngayVN(), all = H.tatCa(v.d, v.m, v.y), info = all.ngay.info;
    var sv = ls_get('chotuvi_sinh'), chiCon = -1;
    try { var l = laSo || (sv && sv.sinh ? lapTuSinh(sv.sinh) : null); if (l) chiCon = Lich.canChiNam(l.am.nam).chi; } catch (e) {}
    var sao = function (n) { return '<span class="sao">' + '★'.repeat(n) + '<i>' + '★'.repeat(5 - n) + '</i></span>'; };
    var h = '<div class="hn-dau"><h2 id="hnTieuDe">Tử vi hôm nay</h2><a href="/tu-vi-hom-nay">Xem đầy đủ ›</a></div>' +
      '<div class="hn-ngay">' + esc(info.duong.thu + ' ' + v.d + '/' + v.m + ' · ' + info.am.ngay + '/' + info.am.thang + ' âm · ngày ' + info.canChi.ngay + ' · ' + (info.hoangDao.tot ? 'hoàng đạo' : 'hắc đạo')) +
      '<br>Giờ tốt: ' + esc(all.ngay.gioTot.map(function (g) { return g.ten; }).join(', ')) + ' · Tuổi xung: ' + esc(info.tuoiXung.join(', ')) + '</div>' +
      '<div class="hn-luoi">' + all.tuoi.map(function (t) {
        return '<a class="hn-o' + (t.chi === chiCon ? ' cua-con' : '') + '" href="/tu-vi-hom-nay/tuoi-' + t.slug + '" aria-label="Tuổi ' + esc(t.ten) + ', ' + t.sao + ' trên 5 sao">' +
          '<svg viewBox="0 0 100 100" aria-hidden="true">' + GIAP_HINH[t.chi] + '</svg><b>' + esc(t.ten) + '</b>' + sao(t.sao) + '</a>';
      }).join('') + '</div>';
    if (chiCon >= 0) { var tc = all.tuoi[chiCon]; h += '<div class="hn-tuoi"><b>Tuổi ' + esc(tc.ten) + ' của con:</b> ' + esc(tc.tomTat) + ' <a href="/tu-vi-hom-nay/tuoi-' + tc.slug + '">Xem chi tiết ›</a></div>'; }
    card.innerHTML = h;
    card.classList.remove('hidden');
  } catch (e) {
    console.error('Lỗi vẽ tử vi hôm nay:', e);
  }
}
window.veHomNay = veHomNay;
veHomNay();
window.addEventListener('load', veHomNay);

/* ---------- Giao diện sáng / tối: mặc định theo máy, bấm nút để đổi qua lại ---------- */
(function () {
  var MAT_TROI = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>';
  var MAT_TRANG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
  var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  function dangToi() { var t = document.documentElement.getAttribute('data-theme'); return t ? t === 'dark' : !!(mq && mq.matches); }
  function veNut() {
    var toi = dangToi(), b = $('#btnGiaoDien');
    b.innerHTML = toi ? MAT_TROI : MAT_TRANG;
    b.setAttribute('aria-label', toi ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'); b.title = b.getAttribute('aria-label');
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', '#1d1729');
  }
  var hen = null;
  function bao(t) {
    var d = document.querySelector('.toast-gd'); if (!d) { d = document.createElement('div'); d.className = 'toast-gd'; d.setAttribute('role', 'status'); document.body.appendChild(d); }
    d.textContent = t; d.style.opacity = 1; clearTimeout(hen); hen = setTimeout(function () { d.style.opacity = 0; }, 1400);
  }
  veNut();
  if (mq && mq.addEventListener) mq.addEventListener('change', veNut);
  $('#btnGiaoDien').addEventListener('click', function () {
    var moi = dangToi() ? 'sang' : 'toi';
    document.documentElement.setAttribute('data-theme', moi === 'toi' ? 'dark' : 'light');
    try { localStorage.setItem('chotuvi_giaodien', moi); } catch (e) {}
    veNut(); bao(moi === 'toi' ? 'Đã chuyển giao diện tối' : 'Đã chuyển giao diện sáng');
  });
})();

var savedSinh = ls_get('chotuvi_sinh');
if (savedSinh && savedSinh.sinh) { try { $('#xnNamSinh').value = T.anLaSo(savedSinh.sinh).am.nam; } catch (e) {} }

$('#btnXemNgay').addEventListener('click', function () {
  var out = $('#xnOut');
  var ns = parseInt($('#xnNamSinh').value, 10); if (!(ns >= 1900 && ns <= 2100)) ns = null;
  var tu = $('#xnTu').value ? parseIso($('#xnTu').value) : now;
  var den = new Date(tu); den.setDate(den.getDate() + (+$('#xnSoNgay').value) - 1);
  var ds = L.timNgayTot(tu, den, viec, ns);
  var chiTot = $('#xnChiTot').checked;
  var hien = chiTot ? ds.filter(function (x) { return x.dg.muc === 'Tốt'; }) : ds;
  var h = '';
  if (ns && ['cuoihoi', 'dongtho', 'nhaptrach'].indexOf(viec) >= 0) {
    var amTu = L.duongSangAm(tu.getDate(), tu.getMonth() + 1, tu.getFullYear());
    var xt = L.xemTuoi(ns, amTu.nam), loi = [];
    if (xt.kimLau) loi.push('phạm ' + xt.kimLau);
    if (viec !== 'cuoihoi' && xt.hoangOcXau) loi.push('phạm ' + xt.hoangOc);
    if (viec !== 'cuoihoi' && xt.tamTai) loi.push('đang hạn Tam Tai');
    h += '<div class="warn ' + (loi.length ? 'bad' : 'good') + '"><strong>Tuổi ' + esc(L.ten(L.canChiNam(ns))) + ' năm ' + esc(xt.namXem) + ' (' + xt.tuoiMu + ' tuổi mụ):</strong> ' +
      (loi.length ? esc(loi.join('; ')) + '. Dân gian thường mượn tuổi người khác' + (viec === 'cuoihoi' ? ' hoặc lùi sang năm.' : ' đứng ra làm.') : 'không phạm Kim Lâu' + (viec !== 'cuoihoi' ? ', Hoang Ốc, Tam Tai' : '') + '. Năm nay làm được.') +
      (viec === 'cuoihoi' ? '<br><span class="small">Kim Lâu khi cưới thường xét theo tuổi cô dâu.</span>' : '') + '</div>';
  }
  if (viec === 'antang') h += '<div class="warn good">Việc tang thường không chờ được ngày đẹp. Hãy xem giờ hoàng đạo của ngày định làm lễ, và tránh giờ xung với tuổi người mất.</div>';
  h += '<div class="card"><h2>' + esc(L.VIEC[viec].ten) + ': ' + hien.length + ' ngày ' + (chiTot ? 'tốt' : '') + '</h2>';
  if (!hien.length) h += '<p class="muted">Không có ngày tốt trong khoảng này. Thử xem dài hơn, hoặc bỏ chọn “Chỉ hiện ngày tốt”.</p>';
  hien.forEach(function (x) {
    var i = x.info, cls = x.dg.muc === 'Tốt' ? 'good' : x.dg.muc === 'Xấu' ? 'bad' : 'mid';
    h += '<div class="result"><div class="top"><div><div class="dd">' + esc(i.duong.thu) + ', ' + i.duong.ngay + '/' + i.duong.thang + '/' + i.duong.nam + '</div>' +
      '<div class="small muted">Âm ' + i.am.ngay + '/' + i.am.thang + (i.am.nhuan ? 'n' : '') + ' · ngày ' + esc(i.canChi.ngay) + ' · trực ' + esc(i.truc.ten) + '</div></div>' +
      '<span class="pill ' + cls + '">' + x.dg.muc + ' · ' + x.dg.diem + '</span></div>' +
      '<ul class="reasons">' + x.dg.lyDo.map(function (r) { return '<li class="' + (r.tot === true ? 'y' : r.tot === false ? 'n' : 'o') + '">' + esc(r.t) + '</li>'; }).join('') + '</ul>' +
      '<div class="small" style="margin-top:6px"><strong>Giờ tốt:</strong> ' + i.gio.filter(function (g) { return g.tot; }).map(function (g) { return esc(g.ten + ' (' + g.khoang + ')'); }).join(', ') + '</div></div>';
  });
  h += '<p class="disclaimer">Cách chấm điểm dựa trên ngày hoàng đạo, 12 trực, các ngày kỵ dân gian (Tam Nương, Nguyệt Kỵ, Dương Công) và tuổi xung. Chỉ để tham khảo.</p></div>';
  out.innerHTML = h;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


var btnPerm = document.getElementById('btnPermalink');
if (btnPerm) {
  btnPerm.addEventListener('click', function () {
    if (!curLaSo) return;
    var tenSlug = boDau(curLaSo.ten || 'duong-so').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'duong-so';
    var gtSlug = (curInfo && curInfo.gt === 'nu') ? 'nu' : 'nam';
    var ccSlug = boDau(curLaSo.canChi.nam || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    var d = String(curInfo ? curInfo.ngay : curLaSo.duong.ngay).padStart(2, '0');
    var m = String(curInfo ? curInfo.thang : curLaSo.duong.thang).padStart(2, '0');
    var y = String(curInfo ? curInfo.nam : curLaSo.duong.nam);
    var g = String(curInfo ? curInfo.gio : 12).padStart(2, '0');
    var s = gtSlug === 'nam' ? '1' : '0';
    var l = (curInfo && curInfo.lich === 'am') ? '1' : '0';
    var n = (curInfo && curInfo.nhuan) ? '1' : '0';
    var v = String(curLaSo.namXem || 2026);
    var slug = 'la-so-tu-vi-' + tenSlug + '-' + y + '-' + gtSlug + (ccSlug ? '-' + ccSlug : '') + '-d' + d + 'm' + m + 'y' + y + 'g' + g + 's' + s + 'l' + l + 'n' + n + 'v' + v;
    var url = window.location.origin + '/la-so/' + slug;
    fetch('/api/la-so', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug, info: curInfo, laSo: curLaSo })
    }).catch(function () {});
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        var msg = document.getElementById('taiMsg');
        if (msg) msg.innerHTML = 'Đã sao chép Permalink: <a href="/la-so/' + slug + '" style="color:var(--red);font-weight:700">/la-so/' + slug + '</a>';
      }).catch(function () {
        window.location.href = '/la-so/' + slug;
      });
    } else {
      window.location.href = '/la-so/' + slug;
    }
  });
}


}
startApp();
})();
