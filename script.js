// 우리동네 국·공유재산을 한눈에 — 화면 미리보기 데모와 사용자 탭
// 모든 재산 정보는 설명을 위한 예시입니다.

const SVG_NS = 'http://www.w3.org/2000/svg';

const OWNER_LABEL = { kuk: '국유', gong: '공유' };
const STATUS_LABEL = { lease: '대부 중', permit: '사용허가 중', available: '활용 가능' };
const DOCS = [
  { key: 'apply', name: '사용(대부)허가 신청서' },
  { key: 'buy', name: '매수신청서' },
  { key: 'giveup', name: '사용(대부)허가 포기서' },
];

// 예시 필지: points는 480x360 지도 좌표
const PARCELS = [
  {
    id: 'P1', jibun: '갈마동 312-7', jimok: '대', area: 180.4,
    owner: 'gong', ownerName: '대전광역시 서구', status: 'lease',
    statusDetail: '주거용으로 대부 중이며, 대부 기간은 2025년 3월부터 2030년 2월까지입니다.',
    docs: { apply: false, buy: true, giveup: true },
    hint: '이미 대부 중인 땅이라 새 사용(대부)허가 신청은 받지 않습니다. 현재 대부받은 분은 매수신청서나 포기서를 낼 수 있습니다.',
    points: [[96, 12], [190, 12], [186, 76], [90, 80]],
  },
  {
    id: 'P2', jibun: '갈마동 314', jimok: '잡종지', area: 526.0,
    owner: 'kuk', ownerName: '기획재정부', status: 'available',
    statusDetail: '지금 사용하는 사람이 없어 사용(대부)허가나 매수를 신청할 수 있습니다.',
    docs: { apply: true, buy: true, giveup: false },
    hint: '포기서는 이 땅을 사용·대부 중인 분만 낼 수 있습니다.',
    points: [[90, 80], [244, 74], [244, 164], [84, 164]],
  },
  {
    id: 'P3', jibun: '월평동 88-2', jimok: '공원', area: 1204.0,
    owner: 'gong', ownerName: '대전광역시', status: 'permit',
    statusDetail: '주민 텃밭으로 사용허가 중이며, 허가 기간은 2026년 12월까지입니다.',
    docs: { apply: false, buy: false, giveup: true },
    hint: '공원은 행정재산이라 매각 대상이 아닙니다. 현재 사용허가를 받은 분은 포기서를 낼 수 있습니다.',
    points: [[372, 12], [468, 12], [468, 88], [372, 92]],
  },
  {
    id: 'P4', jibun: '월평동 91', jimok: '전', area: 342.0,
    owner: 'kuk', ownerName: '기획재정부', status: 'available',
    statusDetail: '지금 사용하는 사람이 없어 사용(대부)허가나 매수를 신청할 수 있습니다.',
    docs: { apply: true, buy: true, giveup: false },
    hint: '포기서는 이 땅을 사용·대부 중인 분만 낼 수 있습니다.',
    points: [[372, 92], [468, 88], [468, 164], [380, 164]],
  },
  {
    id: 'P5', jibun: '도마동 45-3', jimok: '답', area: 610.5,
    owner: 'gong', ownerName: '대전광역시 서구', status: 'available',
    statusDetail: '지금 사용하는 사람이 없어 사용(대부)허가나 매수를 신청할 수 있습니다.',
    docs: { apply: true, buy: true, giveup: false },
    hint: '포기서는 이 땅을 사용·대부 중인 분만 낼 수 있습니다.',
    points: [[12, 200], [128, 200], [120, 290], [12, 296]],
  },
  {
    id: 'P6', jibun: '도마동 52-1', jimok: '대', area: 298.7,
    owner: 'kuk', ownerName: '기획재정부', status: 'permit',
    statusDetail: '공영주차장으로 사용허가 중이며, 허가 기간은 2027년 6월까지입니다.',
    docs: { apply: false, buy: false, giveup: true },
    hint: '행정재산으로 쓰이고 있어 매각 대상이 아닙니다. 현재 사용허가를 받은 분은 포기서를 낼 수 있습니다.',
    points: [[360, 200], [468, 200], [468, 348], [352, 348], [356, 270]],
  },
];

// 개인 소유 등 조회 대상이 아닌 필지
const PRIVATE_LOTS = [
  [[12, 12], [96, 12], [90, 80], [12, 84]],
  [[190, 12], [244, 12], [244, 74], [186, 76]],
  [[12, 84], [90, 80], [84, 164], [12, 164]],
  [[276, 12], [372, 12], [372, 92], [276, 98]],
  [[276, 98], [372, 92], [380, 164], [276, 164]],
  [[128, 200], [244, 200], [244, 284], [120, 290]],
  [[12, 296], [120, 290], [244, 284], [244, 348], [12, 348]],
  [[276, 200], [360, 200], [356, 270], [276, 276]],
  [[276, 276], [356, 270], [352, 348], [276, 348]],
];

const ROADS = [
  { x: 0, y: 164, w: 480, h: 36, name: '계룡로', tx: 330, ty: 186 },
  { x: 244, y: 0, w: 32, h: 360, name: '대덕대로', tx: 260, ty: 262, vertical: true },
];

const state = { selectedId: null, drawing: 'cadastral' };
let toastTimer = null;

// ---------- 도우미 ----------
function svgEl(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}
const toPoints = (pts) => pts.map((p) => p.join(',')).join(' ');
const centroid = (pts) => {
  const n = pts.length;
  return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
};
const formatArea = (a) => `${a.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}㎡`;
const lotNumber = (jibun) => jibun.split(' ').pop();

function drawRoads(svg, cls, withNames) {
  ROADS.forEach((r) => {
    svgEl('rect', { class: cls, x: r.x, y: r.y, width: r.w, height: r.h }, svg);
    if (withNames) {
      const t = svgEl('text', { class: 'road-name', x: r.tx, y: r.ty }, svg);
      if (r.vertical) t.classList.add('vertical');
      t.textContent = r.name;
    }
  });
}

// ---------- 데모 지도 ----------
function renderMap() {
  const svg = document.getElementById('demo-map');
  if (!svg) return;

  drawRoads(svg, 'road', true);
  PRIVATE_LOTS.forEach((pts) => svgEl('polygon', { class: 'lot-private', points: toPoints(pts) }, svg));

  PARCELS.forEach((p) => {
    const poly = svgEl('polygon', {
      class: `parcel parcel-${p.owner}`,
      points: toPoints(p.points),
      'data-parcel': p.id,
      tabindex: '0',
      role: 'button',
      'aria-pressed': 'false',
      'aria-label': `${p.jibun}, ${OWNER_LABEL[p.owner]}, ${STATUS_LABEL[p.status]}`,
    }, svg);
    poly.addEventListener('click', () => selectParcel(p.id));
    poly.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectParcel(p.id); }
    });

    const [cx, cy] = centroid(p.points);
    const label = svgEl('text', { class: 'parcel-no', x: cx, y: cy + (p.status === 'available' ? 20 : 4) }, svg);
    label.textContent = lotNumber(p.jibun);
    if (p.status === 'available') svgEl('circle', { class: 'parcel-dot', cx, cy: cy - 4, r: 6 }, svg);
  });
}

function selectParcel(id) {
  const parcel = PARCELS.find((p) => p.id === id);
  if (!parcel) return;
  state.selectedId = id;
  document.querySelectorAll('#demo-map .parcel').forEach((el) => {
    const on = el.dataset.parcel === id;
    el.classList.toggle('is-selected', on);
    el.setAttribute('aria-pressed', String(on));
  });
  renderCard(parcel);
}

// ---------- 정보 카드 ----------
function renderCard(parcel) {
  const card = document.getElementById('demo-card');
  const statusClass = parcel.status === 'available' ? ' status-available' : '';

  card.innerHTML = `
    <div class="card-tags">
      <span class="owner-chip owner-${parcel.owner}">${OWNER_LABEL[parcel.owner]}</span>
      <span class="status-chip${statusClass}">${STATUS_LABEL[parcel.status]}</span>
    </div>
    <h3>${parcel.jibun}</h3>
    <dl class="card-facts">
      <div><dt>지목</dt><dd>${parcel.jimok}</dd></div>
      <div><dt>면적</dt><dd>${formatArea(parcel.area)}</dd></div>
      <div class="wide"><dt>소유자</dt><dd>${OWNER_LABEL[parcel.owner]}(${parcel.ownerName})</dd></div>
      <div class="wide"><dt>사용·대부 현황</dt><dd>${parcel.statusDetail}</dd></div>
    </dl>
    <div class="drawing">
      <div class="drawing-head">
        <span class="drawing-title">도면 보기</span>
        <div class="seg" role="group" aria-label="도면 종류">
          <button type="button" data-drawing="cadastral">지적도</button>
          <button type="button" data-drawing="location">위치도</button>
        </div>
      </div>
      <svg class="drawing-svg" role="img"></svg>
    </div>
    <div class="docs">
      <p class="docs-title">서류 신청</p>
      <div class="docs-list">
        ${DOCS.map((d) => `
          <button type="button" class="doc-btn" data-doc="${d.name}" ${parcel.docs[d.key] ? '' : 'disabled'}>
            ${d.name}<small>${parcel.docs[d.key] ? '작성하기' : '해당 없음'}</small>
          </button>`).join('')}
      </div>
      <p class="docs-hint">${parcel.hint}</p>
    </div>`;

  card.querySelectorAll('[data-drawing]').forEach((btn) => {
    btn.addEventListener('click', () => setDrawing(btn.dataset.drawing));
  });
  card.querySelectorAll('.doc-btn:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', () => showToast(btn.dataset.doc));
  });
  hideToast();
  setDrawing(state.drawing);
}

// ---------- 도면: 지적도 / 위치도 ----------
function setDrawing(kind) {
  state.drawing = kind;
  const parcel = PARCELS.find((p) => p.id === state.selectedId);
  const svg = document.querySelector('#demo-card .drawing-svg');
  if (!parcel || !svg) return;

  document.querySelectorAll('#demo-card [data-drawing]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.drawing === kind));
  });
  svg.replaceChildren();

  if (kind === 'cadastral') drawCadastral(svg, parcel);
  else drawLocation(svg, parcel);
}

function drawCadastral(svg, parcel) {
  // 대상 필지 둘레를 4:3 비율로 확대
  const xs = parcel.points.map((p) => p[0]);
  const ys = parcel.points.map((p) => p[1]);
  const pad = 34;
  let w = Math.max(...xs) - Math.min(...xs) + pad * 2;
  let h = Math.max(...ys) - Math.min(...ys) + pad * 2;
  if (w / h > 4 / 3) h = w * 3 / 4; else w = h * 4 / 3;
  const [cx, cy] = centroid(parcel.points);
  const x0 = (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2;
  const y0 = (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2;
  svg.setAttribute('viewBox', `${x0} ${y0} ${w} ${h}`);
  svg.setAttribute('aria-label', `${parcel.jibun} 지적도. 대상 필지 경계가 굵은 선으로 표시되어 있습니다.`);

  const fs = w / 18;
  [...PRIVATE_LOTS, ...PARCELS.filter((p) => p.id !== parcel.id).map((p) => p.points)]
    .forEach((pts) => svgEl('polygon', { class: 'dw-lot', points: toPoints(pts) }, svg));
  svgEl('polygon', { class: 'dw-target', points: toPoints(parcel.points) }, svg);

  const no = svgEl('text', { class: 'dw-label', x: cx, y: cy, 'font-size': fs }, svg);
  no.textContent = `${lotNumber(parcel.jibun)} ${parcel.jimok}`;
  const area = svgEl('text', { class: 'dw-sub', x: cx, y: cy + fs * 1.3, 'font-size': fs * 0.75 }, svg);
  area.textContent = formatArea(parcel.area);

  // 방위 표시
  const nx = x0 + w - fs * 1.4, ny = y0 + fs * 1.1;
  svgEl('path', { class: 'dw-north', d: `M${nx} ${ny + fs * 1.6} L${nx} ${ny + fs * 0.3} M${nx - fs * 0.35} ${ny + fs * 0.75} L${nx} ${ny + fs * 0.3} L${nx + fs * 0.35} ${ny + fs * 0.75}` }, svg);
  const n = svgEl('text', { class: 'dw-north-n', x: nx, y: ny + fs * 0.1, 'font-size': fs * 0.7 }, svg);
  n.textContent = 'N';
}

function drawLocation(svg, parcel) {
  svg.setAttribute('viewBox', '0 0 480 360');
  svg.setAttribute('aria-label', `${parcel.jibun} 위치도. 계룡로와 대덕대로 사이 블록에서의 위치가 표시되어 있습니다.`);

  drawRoads(svg, 'dw-road', false);
  ROADS.forEach((r) => {
    const t = svgEl('text', { class: 'dw-sub', x: r.vertical ? r.tx : 120, y: r.vertical ? 60 : r.ty, 'font-size': 13 }, svg);
    if (r.vertical) t.classList.add('vertical');
    t.textContent = r.name;
  });
  [[12, 12, 232, 152], [276, 12, 192, 152], [12, 200, 232, 148], [276, 200, 192, 148]]
    .forEach(([x, y, w, h]) => svgEl('rect', { class: 'dw-block', x, y, width: w, height: h }, svg));
  svgEl('polygon', { class: 'dw-target', points: toPoints(parcel.points) }, svg);

  const [cx, cy] = centroid(parcel.points);
  svgEl('circle', { class: 'dw-pin', cx, cy, r: 9 }, svg);
  const label = svgEl('text', { class: 'dw-label', x: cx, y: cy < 60 ? cy + 32 : cy - 18, 'font-size': 15 }, svg);
  label.textContent = '대상지';
}

// ---------- 서류 버튼 안내 ----------
function showToast(docName) {
  const toast = document.getElementById('demo-toast');
  toast.textContent = `예시 화면입니다. 실제 서비스에서는 여기서 ${docName} 작성 화면이 열립니다.`;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 5000);
}
function hideToast() {
  const toast = document.getElementById('demo-toast');
  if (toast) toast.hidden = true;
}

// ---------- 사용자 탭 ----------
function setAudience(who) {
  document.querySelectorAll('[role="tab"][data-audience]').forEach((tab) => {
    const on = tab.dataset.audience === who;
    tab.setAttribute('aria-selected', String(on));
    tab.tabIndex = on ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !on;
  });
}

function initTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"][data-audience]')];
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setAudience(tab.dataset.audience));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      setAudience(next.dataset.audience);
      next.focus();
    });
  });
}

renderMap();
selectParcel('P2');
initTabs();
