// 우리동네 국·공유재산을 한눈에 — 화면 미리보기 데모와 사용자 탭
// 모든 재산 정보는 설명을 위한 예시입니다.

const SVG_NS = 'http://www.w3.org/2000/svg';

const OWNER_LABEL = { kuk: '국유', si: '시유', gu: '구유' };
const STATUS_LABEL = { lease: '대부 중', permit: '사용허가 중', available: '활용 가능', unavailable: '대부 불가' };
// 토지이음 토지이용계획 열람 페이지(새 창으로 열기)
const EUM_LAND_PLAN_URL = 'https://www.eum.go.kr/web/ar/lu/luLandDet.jsp';
const DOCS = [
  { key: 'apply', name: '사용(대부)허가 신청서' },
  { key: 'buy', name: '매수신청서' },
  { key: 'giveup', name: '사용(대부)허가 포기서' },
];

// 예시 필지: points는 480x360 지도 좌표
const PARCELS = [
  {
    id: 'P1', jibun: '갈마동 312-7', jimok: '대', area: 180.4,
    owner: 'gu', ownerName: '대전광역시 서구', status: 'lease',
    statusDetail: '주거용으로 대부 중이며, 대부 기간은 2025년 3월부터 2030년 2월까지입니다.',
    docs: { apply: false, buy: true, giveup: true },
    hint: '이미 대부 중인 땅이라 새 사용(대부)허가 신청은 받지 않습니다. 현재 대부받은 분은 매수신청서나 포기서를 낼 수 있습니다.',
    zoning: { area: '제2종일반주거지역', district: '없음', zone: '가축사육제한구역' },
    use: 'house', useText: '단독주택 1동과 마당이 있습니다.',
    points: [[96, 12], [190, 12], [186, 76], [90, 80]],
  },
  {
    id: 'P2', jibun: '갈마동 314', jimok: '잡종지', area: 526.0,
    owner: 'kuk', ownerName: '기획재정부', status: 'available',
    statusDetail: '지금 사용하는 사람이 없어 사용(대부)허가나 매수를 신청할 수 있습니다.',
    docs: { apply: true, buy: true, giveup: false },
    hint: '포기서는 이 땅을 사용·대부 중인 분만 낼 수 있습니다.',
    zoning: { area: '제2종일반주거지역', district: '없음', zone: '가축사육제한구역' },
    use: 'bare', useText: '건물 없이 비어 있는 땅입니다.',
    points: [[90, 80], [244, 74], [244, 164], [84, 164]],
  },
  {
    id: 'P3', jibun: '월평동 88-2', jimok: '공원', area: 1204.0,
    owner: 'si', ownerName: '대전광역시', status: 'permit',
    statusDetail: '주민 텃밭으로 사용허가 중이며, 허가 기간은 2026년 12월까지입니다.',
    docs: { apply: false, buy: false, giveup: true },
    hint: '공원은 행정재산이라 매각 대상이 아닙니다. 현재 사용허가를 받은 분은 포기서를 낼 수 있습니다.',
    zoning: { area: '자연녹지지역', district: '없음', zone: '도시·군계획시설(근린공원)' },
    use: 'garden', useText: '주민 텃밭으로 가꾸고 있습니다.',
    points: [[372, 12], [468, 12], [468, 88], [372, 92]],
  },
  {
    id: 'P4', jibun: '월평동 91', jimok: '전', area: 342.0,
    owner: 'kuk', ownerName: '기획재정부', status: 'available',
    statusDetail: '지금 사용하는 사람이 없어 사용(대부)허가나 매수를 신청할 수 있습니다.',
    docs: { apply: true, buy: true, giveup: false },
    hint: '포기서는 이 땅을 사용·대부 중인 분만 낼 수 있습니다.',
    zoning: { area: '자연녹지지역', district: '없음', zone: '개발제한구역' },
    use: 'field', useText: '밭고랑만 남아 있고 경작하지 않고 있습니다.',
    points: [[372, 92], [468, 88], [468, 164], [380, 164]],
  },
  {
    id: 'P5', jibun: '도마동 45-3', jimok: '대', area: 610.5,
    owner: 'gu', ownerName: '대전광역시 서구', status: 'unavailable',
    statusDetail: '주택이 들어서 있어 사용(대부)허가나 매수를 신청할 수 없습니다.',
    docs: { apply: false, buy: false, giveup: false },
    hint: '건물이 있는 땅이라 지금은 대부나 매각 대상이 아닙니다.',
    zoning: { area: '제2종일반주거지역', district: '없음', zone: '가축사육제한구역' },
    use: 'house', useText: '주택이 들어서 있습니다.',
    points: [[12, 200], [128, 200], [120, 290], [12, 296]],
  },
  {
    id: 'P6', jibun: '도마동 52-1', jimok: '대', area: 298.7,
    owner: 'kuk', ownerName: '기획재정부', status: 'permit',
    statusDetail: '공영주차장으로 사용허가 중이며, 허가 기간은 2027년 6월까지입니다.',
    docs: { apply: false, buy: false, giveup: true },
    hint: '행정재산으로 쓰이고 있어 매각 대상이 아닙니다. 현재 사용허가를 받은 분은 포기서를 낼 수 있습니다.',
    zoning: { area: '일반상업지역', district: '방화지구', zone: '도시·군계획시설(주차장)' },
    use: 'parking', useText: '공영주차장으로 쓰고 있습니다.',
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

  // 활용 가능 필지에 겹칠 빗금 무늬
  const defs = svgEl('defs', {}, svg);
  const hatch = svgEl('pattern', { id: 'demo-hatch', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
  svgEl('rect', { width: 2.2, height: 8, fill: 'rgba(15, 34, 51, 0.55)' }, hatch);

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

    if (p.status === 'available') svgEl('polygon', { class: 'parcel-hatch', points: toPoints(p.points), fill: 'url(#demo-hatch)' }, svg);
    const [cx, cy] = centroid(p.points);
    const label = svgEl('text', { class: 'parcel-no', x: cx, y: cy + 4 }, svg);
    label.textContent = lotNumber(p.jibun);
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
    <section class="zoning" aria-label="토지이용계획">
      <div class="zoning-head">
        <p class="zoning-title">토지이용계획</p>
        <span class="zoning-badge">예시</span>
      </div>
      <dl class="zoning-list">
        <div><dt>용도지역</dt><dd>${parcel.zoning.area}</dd></div>
        <div><dt>용도지구</dt><dd>${parcel.zoning.district}</dd></div>
        <div><dt>용도구역·기타</dt><dd>${parcel.zoning.zone}</dd></div>
      </dl>
      <a class="eum-link" href="${EUM_LAND_PLAN_URL}" target="_blank" rel="noopener noreferrer">
        토지이음에서 토지이용계획 열람
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 2h5v5M14 2 7 9"/></svg>
        <span class="sr-only">(새 창)</span>
      </a>
      <p class="zoning-hint">실제 서비스에서는 필지를 고르면 토지이음과 같은 국토교통부 토지이용계획 정보를 공개 API로 자동으로 불러옵니다.</p>
    </section>
    <div class="drawing">
      <div class="drawing-head">
        <span class="drawing-title">도면 보기</span>
        <div class="seg" role="group" aria-label="도면 종류">
          <button type="button" data-drawing="cadastral">지적도</button>
          <button type="button" data-drawing="location">위치도</button>
          <button type="button" data-drawing="current">현황도</button>
        </div>
      </div>
      <svg class="drawing-svg" role="img"></svg>
      <p class="drawing-note"></p>
    </div>
    ${parcel.photos ? `
    <div class="photos">
      <p class="docs-title">실제 사진 샘플</p>
      <div class="photo-grid">
        ${parcel.photos.map((ph) => `
          <figure>
            <a href="${ph.src}" target="_blank" rel="noopener noreferrer"><img src="${ph.src}" alt="${ph.alt}" loading="lazy"><span class="sr-only">(원본 크기로 새 창에서 보기)</span></a>
            <figcaption>${ph.label}<small>출처: ${ph.source}</small></figcaption>
          </figure>`).join('')}
      </div>
    </div>` : ''}
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
  else if (kind === 'current') drawCurrent(svg, parcel);
  else drawLocation(svg, parcel);

  const note = document.querySelector('#demo-card .drawing-note');
  if (note) note.textContent = kind === 'current' ? `${parcel.useText} 그림으로 표현한 예시 현황도입니다.` : DRAWING_NOTE[kind];
}

const DRAWING_NOTE = {
  cadastral: '필지의 경계와 모양, 지번을 보여줍니다.',
  location: '주변 도로와 블록 속에서 어디에 있는지 보여줍니다.',
};

// 대상 필지 둘레를 4:3 비율로 확대한 viewBox
function fitView(parcel) {
  const xs = parcel.points.map((p) => p[0]);
  const ys = parcel.points.map((p) => p[1]);
  const pad = 34;
  let w = Math.max(...xs) - Math.min(...xs) + pad * 2;
  let h = Math.max(...ys) - Math.min(...ys) + pad * 2;
  if (w / h > 4 / 3) h = w * 3 / 4; else w = h * 4 / 3;
  const x0 = (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2;
  const y0 = (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2;
  return { x0, y0, w, h, fs: w / 18 };
}

function drawNorth(svg, { x0, y0, w, fs }, cls = '') {
  const nx = x0 + w - fs * 1.4, ny = y0 + fs * 1.1;
  svgEl('path', { class: `dw-north ${cls}`, d: `M${nx} ${ny + fs * 1.6} L${nx} ${ny + fs * 0.3} M${nx - fs * 0.35} ${ny + fs * 0.75} L${nx} ${ny + fs * 0.3} L${nx + fs * 0.35} ${ny + fs * 0.75}` }, svg);
  const n = svgEl('text', { class: `dw-north-n ${cls}`, x: nx, y: ny + fs * 0.1, 'font-size': fs * 0.7 }, svg);
  n.textContent = 'N';
}

function drawCadastral(svg, parcel) {
  const view = fitView(parcel);
  const { x0, y0, w, h, fs } = view;
  svg.setAttribute('viewBox', `${x0} ${y0} ${w} ${h}`);
  svg.setAttribute('aria-label', `${parcel.jibun} 지적도. 대상 필지 경계가 굵은 선으로 표시되어 있습니다.`);

  [...PRIVATE_LOTS, ...PARCELS.filter((p) => p.id !== parcel.id).map((p) => p.points)]
    .forEach((pts) => svgEl('polygon', { class: 'dw-lot', points: toPoints(pts) }, svg));
  svgEl('polygon', { class: 'dw-target', points: toPoints(parcel.points) }, svg);

  const [cx, cy] = centroid(parcel.points);
  const no = svgEl('text', { class: 'dw-label', x: cx, y: cy, 'font-size': fs }, svg);
  no.textContent = `${lotNumber(parcel.jibun)} ${parcel.jimok}`;
  const area = svgEl('text', { class: 'dw-sub', x: cx, y: cy + fs * 1.3, 'font-size': fs * 0.75 }, svg);
  area.textContent = formatArea(parcel.area);

  drawNorth(svg, view);
}

// ---------- 현황도: 위에서 내려다본 모습(그림 예시) ----------
const ROOF_COLORS = ['#8d99a6', '#a88b6e', '#7f8c7d', '#9a8fa0'];
const CAR_COLORS = ['#f4f1e6', '#c0392b', '#2f4f6f', '#d9d4c5'];
const scalePoints = (pts, k) => {
  const [cx, cy] = centroid(pts);
  return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
};

function addPatterns(defs) {
  const stripes = (id, bg, line, size, angle) => {
    const p = svgEl('pattern', { id, width: size, height: size, patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${angle})` }, defs);
    svgEl('rect', { width: size, height: size, fill: bg }, p);
    svgEl('rect', { width: size, height: size * 0.45, fill: line }, p);
  };
  stripes('cur-garden', '#93b872', '#6f9a55', 9, 90);
  stripes('cur-field', '#c4aa78', '#a88d5f', 10, 12);
  stripes('cur-paddy', '#9bbfa9', '#86ad97', 8, -8);

  const bare = svgEl('pattern', { id: 'cur-bare', width: 14, height: 14, patternUnits: 'userSpaceOnUse' }, defs);
  svgEl('rect', { width: 14, height: 14, fill: '#cfb994' }, bare);
  svgEl('circle', { cx: 3, cy: 4, r: 1.3, fill: '#b39c75' }, bare);
  svgEl('circle', { cx: 10, cy: 10, r: 1.1, fill: '#e2d2ae' }, bare);

  const parking = svgEl('pattern', { id: 'cur-parking', width: 16, height: 36, patternUnits: 'userSpaceOnUse' }, defs);
  svgEl('rect', { width: 16, height: 36, fill: '#6d7174' }, parking);
  svgEl('rect', { width: 1.2, height: 26, fill: '#f4f1e6' }, parking);
}

function paintUse(svg, defs, p) {
  const clipId = `cur-clip-${p.id}`;
  const clip = svgEl('clipPath', { id: clipId }, defs);
  svgEl('polygon', { points: toPoints(p.points) }, clip);
  const g = svgEl('g', { 'clip-path': `url(#${clipId})` }, svg);
  const fill = { house: '#c9c3a6', bare: 'url(#cur-bare)', garden: 'url(#cur-garden)', field: 'url(#cur-field)', paddy: 'url(#cur-paddy)', parking: 'url(#cur-parking)' }[p.use];
  svgEl('polygon', { points: toPoints(p.points), fill }, g);
  const [cx, cy] = centroid(p.points);

  if (p.use === 'house') {
    const roof = scalePoints(p.points, 0.5);
    svgEl('polygon', { points: toPoints(roof.map(([x, y]) => [x + 3, y + 3])), fill: 'rgba(30,43,35,.3)' }, g);
    svgEl('polygon', { points: toPoints(roof), fill: '#6f7f8c' }, g);
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const [l, r] = [mid(roof[0], roof[3]), mid(roof[1], roof[2])];
    svgEl('line', { x1: l[0], y1: l[1], x2: r[0], y2: r[1], class: 'cur-ridge' }, g);
    svgEl('circle', { cx: roof[0][0] - 8, cy: roof[3][1] + 8, r: 6, fill: '#5f8f4e' }, g);
  }
  if (p.use === 'bare' || p.use === 'field') {
    scalePoints(p.points, 0.62).forEach(([x, y]) => svgEl('circle', { cx: x, cy: y, r: 4.5, fill: '#8fa86b' }, g));
  }
  if (p.use === 'garden') {
    svgEl('rect', { x: cx + 18, y: cy - 30, width: 16, height: 12, fill: '#e8e3cf', stroke: '#6b5b45', 'stroke-width': 1 }, g);
  }
  if (p.use === 'parking') {
    [[-40, -62], [-8, -62], [24, -62], [-40, 8], [8, 8], [24, 8]].forEach(([dx, dy], i) => {
      svgEl('rect', { x: cx + dx + 3, y: cy + dy + 4, width: 10, height: 18, rx: 2.5, fill: CAR_COLORS[i % CAR_COLORS.length] }, g);
    });
  }
}

function drawCurrent(svg, parcel) {
  const view = fitView(parcel);
  const { x0, y0, w, h, fs } = view;
  svg.setAttribute('viewBox', `${x0} ${y0} ${w} ${h}`);
  svg.setAttribute('aria-label', `${parcel.jibun} 현황도. ${parcel.useText} 위에서 내려다본 모습을 그림으로 표현했습니다.`);

  const defs = svgEl('defs', {}, svg);
  addPatterns(defs);

  svgEl('rect', { x: x0, y: y0, width: w, height: h, fill: '#8fa37a' }, svg);
  ROADS.forEach((r) => {
    svgEl('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#5d6166' }, svg);
    const lane = r.vertical
      ? { x1: r.x + r.w / 2, y1: r.y, x2: r.x + r.w / 2, y2: r.y + r.h }
      : { x1: r.x, y1: r.y + r.h / 2, x2: r.x + r.w, y2: r.y + r.h / 2 };
    svgEl('line', { ...lane, class: 'cur-lane' }, svg);
  });

  PRIVATE_LOTS.forEach((pts, i) => {
    svgEl('polygon', { points: toPoints(pts), fill: '#b9b39a', class: 'cur-lot' }, svg);
    const roof = scalePoints(pts, 0.55);
    svgEl('polygon', { points: toPoints(roof.map(([x, y]) => [x + 3, y + 3])), fill: 'rgba(30,43,35,.28)' }, svg);
    svgEl('polygon', { points: toPoints(roof), fill: ROOF_COLORS[i % ROOF_COLORS.length] }, svg);
    const [tx, ty] = scalePoints(pts, 0.86)[i % pts.length];
    svgEl('circle', { cx: tx, cy: ty, r: 5.5, fill: '#5f8f4e' }, svg);
  });
  PARCELS.forEach((p) => paintUse(svg, defs, p));

  svgEl('polygon', { class: 'cur-target', points: toPoints(parcel.points) }, svg);
  const [cx, cy] = centroid(parcel.points);
  const label = svgEl('text', { class: 'cur-label', x: cx, y: cy, 'font-size': fs, 'stroke-width': fs * 0.22 }, svg);
  label.textContent = lotNumber(parcel.jibun);

  drawNorth(svg, view, 'on-photo');
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

// ---------- 첫 화면: 대전 서구 행정동 지도 ----------
const DONG_MAP_URL = 'images/seogu-dong-map.svg';
const HERO_VIEWS = { in: [470, -60, 490, 620], out: [-120, -30, 1200, 1846] };
const HERO_VIEW_LABEL = { in: '보기: 도심', out: '보기: 서구 전체' };

// 새로고침해도 같은 자리에 표시되도록 고정 시드 난수 사용
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// type: kuk 국유, si 시유, gu 구유 / usable: 활용 가능이면 빗금을 겹침
function addHeroLot(layer, x, y, type, usable, angle) {
  const g = svgEl('g', { class: `hm-lot hm-lot-${type}`, transform: `translate(${x} ${y}) rotate(${angle})` }, layer);
  svgEl('rect', { class: 'hm-lot-body', x: -9, y: -7, width: 18, height: 14, rx: 1.5 }, g);
  if (usable) svgEl('rect', { class: 'hm-hatch', x: -9, y: -7, width: 18, height: 14, rx: 1.5, fill: 'url(#hm-hatch)' }, g);
}

// 행정동마다 면적에 맞춰 국·시·구유지 표시를 임의 위치에 뿌림
function scatterHeroLots(dongs, layer) {
  const rand = seededRandom(3804);
  const taken = SURVEY_SPOTS.map((s) => [s.x, s.y]);
  SURVEY_SPOTS.forEach((s) => addHeroLot(layer, s.x, s.y, 'kuk', true, 0));
  const inside = (path, x, y) => [[-11, -9], [11, -9], [-11, 9], [11, 9]]
    .every(([dx, dy]) => path.isPointInFill(new DOMPoint(x + dx, y + dy)));

  dongs.forEach((path) => {
    const box = path.getBBox();
    const count = Math.max(2, Math.min(6, Math.round((box.width * box.height) / 9000)));
    let placed = 0;
    for (let tries = 0; placed < count && tries < count * 60; tries += 1) {
      const x = box.x + rand() * box.width;
      const y = box.y + rand() * box.height;
      if (!inside(path, x, y) || taken.some(([tx, ty]) => Math.hypot(tx - x, ty - y) < 30)) continue;
      const r = rand();
      addHeroLot(layer, x, y, r < 0.3 ? 'kuk' : r < 0.62 ? 'si' : 'gu', rand() < 0.18, Math.round((rand() - 0.5) * 50));
      taken.push([x, y]);
      placed += 1;
    }
  });
}

async function renderHeroMap() {
  const dongLayer = document.getElementById('hm-dongs');
  const lotLayer = document.getElementById('hm-parcels');
  const labelLayer = document.getElementById('hm-labels');
  if (!dongLayer) return;
  try {
    const res = await fetch(DONG_MAP_URL);
    if (!res.ok) return;
    const doc = new DOMParser().parseFromString(await res.text(), 'image/svg+xml');
    [['#dong', dongLayer], ['#outline', dongLayer], ['#dong-labels', labelLayer], ['#neighbor-labels', labelLayer]]
      .forEach(([sel, target]) => {
        const node = doc.querySelector(sel);
        if (node) target.appendChild(document.importNode(node, true));
      });
  } catch (e) {
    return;
  }
  const dongs = [...dongLayer.querySelectorAll('.dong')];

  // 행정동 모양을 수채화 마스크에 복사해 그라데이션 색을 담음
  const washShapes = document.getElementById('hm-wash-shapes');
  if (washShapes) {
    dongs.forEach((dong) => {
      const shape = dong.cloneNode(false);
      shape.removeAttribute('id');
      shape.removeAttribute('class');
      shape.setAttribute('fill', '#fff');
      washShapes.appendChild(shape);
    });
  }

  if (dongs.length && typeof dongs[0].isPointInFill === 'function') scatterHeroLots(dongs, lotLayer);
}

// 움직임 줄이기 설정이면 수채화 색 변화와 번짐 효과를 멈추고 완성된 모습만 보여줌
function initWatercolor() {
  const svg = document.getElementById('hero-svg');
  if (!svg || !matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  svg.querySelectorAll('#hm-wash-grad animate, #hm-wash-grad animateTransform, #hm-reveal-circle animate')
    .forEach((anim) => anim.remove());
  document.getElementById('hm-reveal-circle')?.setAttribute('r', '2000');
}

// 확대(도심) / 축소(서구 전체) 버튼
function initZoom() {
  const svg = document.getElementById('hero-svg');
  const label = document.getElementById('gis-view');
  const buttons = [...document.querySelectorAll('.gis-zoom [data-zoom]')];
  if (!svg || !buttons.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rafId = 0;

  const setView = (key) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.zoom === key)));
    if (label) label.textContent = HERO_VIEW_LABEL[key];
    const from = svg.getAttribute('viewBox').split(' ').map(Number);
    const to = HERO_VIEWS[key];
    cancelAnimationFrame(rafId);
    if (reduce) { svg.setAttribute('viewBox', to.join(' ')); return; }
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 450, 1);
      const k = 1 - (1 - p) ** 3;
      svg.setAttribute('viewBox', from.map((v, i) => v + (to[i] - v) * k).join(' '));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
  };
  buttons.forEach((b) => b.addEventListener('click', () => setView(b.dataset.zoom)));
}

// 레이어 패널: 체크를 끄면 해당 레이어를 지도에서 숨김
function initLayers() {
  const svg = document.getElementById('hero-svg');
  if (!svg) return;
  document.querySelectorAll('.gis-layers input[data-layer]').forEach((input) => {
    input.addEventListener('change', () => svg.classList.toggle(`hide-${input.dataset.layer}`, !input.checked));
  });
}

// ---------- 첫 화면: 드론 필지 순회 조사 ----------
const DRONE_HOME = { x: 840, y: 170 }; // 서구청
const SURVEY_SPOTS = [
  { x: 660, y: 240, name: '갈마동 314' },
  { x: 592, y: 300, name: '월평동 91' },
];

// 이륙 → 필지마다 이동·촬영 → 복귀를 한 바퀴로 반복
function buildSurveySteps() {
  const n = SURVEY_SPOTS.length;
  const steps = [{ kind: 'rest', at: DRONE_HOME, dur: 1400, done: 0, status: '이륙 준비' }];
  let from = DRONE_HOME;
  SURVEY_SPOTS.forEach((spot, i) => {
    steps.push({ kind: 'fly', from, to: spot, dur: i === 1 ? 1600 : 2200, done: i, status: `다음 필지로 이동 중 ${i + 1}/${n}` });
    steps.push({ kind: 'scan', at: spot, dur: 1800, done: i, status: `${spot.name} 촬영 중 ${i + 1}/${n}` });
    from = spot;
  });
  steps.push({ kind: 'fly', from, to: DRONE_HOME, dur: 2400, done: n, status: `조사 완료 ${n}/${n}, 복귀 중` });
  steps.push({ kind: 'rest', at: DRONE_HOME, dur: 1600, done: n, status: `조사 완료 ${n}/${n}` });
  return steps;
}

function initDrone() {
  const drone = document.getElementById('hm-drone');
  if (!drone) return;
  const shadow = document.getElementById('hm-drone-shadow');
  const scan = document.getElementById('hm-scan');
  const status = document.getElementById('hm-hud-status');
  const chips = [...document.querySelectorAll('.hm-done')];

  const place = (x, y, tilt = 0) => {
    drone.setAttribute('transform', `translate(${x} ${y}) rotate(${tilt})`);
    shadow.setAttribute('transform', `translate(${x + 10} ${y + 14})`);
  };
  const apply = (step) => {
    chips.forEach((chip, i) => chip.classList.toggle('is-on', i < step.done));
    scan.classList.toggle('is-on', step.kind === 'scan');
    if (step.kind === 'scan') scan.setAttribute('transform', `translate(${step.at.x} ${step.at.y})`);
    status.textContent = step.status;
  };

  // 움직임 줄이기 설정이면 조사를 마치고 복귀한 정지 화면으로 보여줌
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const n = SURVEY_SPOTS.length;
    place(DRONE_HOME.x, DRONE_HOME.y);
    apply({ kind: 'rest', at: DRONE_HOME, done: n, status: `조사 완료 ${n}/${n}` });
    return;
  }

  const steps = buildSurveySteps();
  const total = steps.reduce((sum, s) => sum + s.dur, 0);
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
  let elapsed = 0, last = 0, current = -1, rafId = 0, inView = true;

  function frame(now) {
    elapsed = (elapsed + Math.min(now - (last || now), 100)) % total;
    last = now;
    let t = elapsed, i = 0;
    while (t >= steps[i].dur) { t -= steps[i].dur; i += 1; }
    const step = steps[i];
    if (i !== current) { current = i; apply(step); }

    if (step.kind === 'fly') {
      const p = t / step.dur, k = ease(p);
      const x = step.from.x + (step.to.x - step.from.x) * k;
      const y = step.from.y + (step.to.y - step.from.y) * k;
      place(x, y, Math.sin(p * Math.PI) * 10 * Math.sign(step.to.x - step.from.x));
    } else {
      place(step.at.x, step.at.y + Math.sin(now / 280) * 1.2);
    }
    rafId = requestAnimationFrame(frame);
  }

  // 화면에 보이지 않을 때는 멈춤
  const play = () => { if (!rafId && inView && !document.hidden) { last = 0; rafId = requestAnimationFrame(frame); } };
  const pause = () => { cancelAnimationFrame(rafId); rafId = 0; };
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) play(); else pause();
  }).observe(drone.ownerSVGElement);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  play();
}

initWatercolor();
renderHeroMap();
initLayers();
initZoom();
renderMap();
selectParcel('P2');
initTabs();
initDrone();
