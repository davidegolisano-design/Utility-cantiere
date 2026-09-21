const app = document.getElementById('app');
const homeButton = document.getElementById('homeButton');

const tools = [
  { id: 'alignment', icon: '⦿', name: 'Allineamento', desc: 'Motore · pompa · giunti' },
  { id: 'keys', icon: '⬡', name: 'Chiavi e bulloneria', desc: 'Esagonali · brugole · filetti' },
  { id: 'flanges', icon: '◎', name: 'Flange', desc: 'EN/DIN · ASME · JIS' },
  { id: 'pipes', icon: '◉', name: 'Tubazioni', desc: 'DN · NPS · Schedule' },
  { id: 'threads', icon: '≋', name: 'Filettature', desc: 'Metrica · BSP · NPT · UNC/UNF' },
  { id: 'converter', icon: '⇄', name: 'Conversioni', desc: 'mm/inch · bar/psi · kW/HP' },
  { id: 'tolerances', icon: '±', name: 'Tolleranze', desc: 'Accoppiamenti · fori · alberi' },
  { id: 'weights', icon: '▰', name: 'Pesi e geometria', desc: 'Piastre · tubi · volumi' }
];

const metricThreads = {
  M3:  { pitch: 0.5, tap: 2.5, socket: 2.5 },
  M4:  { pitch: 0.7, tap: 3.3, isoHex: 7,  dinHex: 7,  socket: 3 },
  M5:  { pitch: 0.8, tap: 4.2, isoHex: 8,  dinHex: 8,  socket: 4 },
  M6:  { pitch: 1.0, tap: 5.0, isoHex: 10, dinHex: 10, socket: 5 },
  M8:  { pitch: 1.25,tap: 6.8, isoHex: 13, dinHex: 13, socket: 6 },
  M10: { pitch: 1.5, tap: 8.5, isoHex: 16, dinHex: 17, socket: 8 },
  M12: { pitch: 1.75,tap: 10.2,isoHex: 18, dinHex: 19, socket: 10 },
  M14: { pitch: 2.0, tap: 12.0,isoHex: 21, dinHex: 22, socket: 12 },
  M16: { pitch: 2.0, tap: 14.0,isoHex: 24, dinHex: 24, socket: 14 },
  M18: { pitch: 2.5, tap: 15.5,isoHex: 27, dinHex: 27, socket: 14 },
  M20: { pitch: 2.5, tap: 17.5,isoHex: 30, dinHex: 30, socket: 17 },
  M22: { pitch: 2.5, tap: 19.5,isoHex: 34, dinHex: 32, socket: 17 },
  M24: { pitch: 3.0, tap: 21.0,isoHex: 36, dinHex: 36, socket: 19 },
  M27: { pitch: 3.0, tap: 24.0,isoHex: 41, dinHex: 41, socket: 19 },
  M30: { pitch: 3.5, tap: 26.5,isoHex: 46, dinHex: 46, socket: 22 }
};

const fastenerTypes = {
  isoHex: {
    label: 'Testa esagonale · ISO 4014/4017',
    keyLabel: 'Chiave esagonale',
    note: 'Serie ISO corrente. Attenzione alle misure che differiscono dalle vecchie DIN.'
  },
  dinHex: {
    label: 'Testa esagonale · DIN 931/933 legacy',
    keyLabel: 'Chiave esagonale',
    note: 'Serie DIN storica/legacy, ancora frequente su impianti e macchine esistenti.'
  },
  socket: {
    label: 'Testa cilindrica a brugola · ISO 4762',
    keyLabel: 'Chiave a brugola',
    note: 'Dimensione dell’esagono incassato secondo ISO 4762 / DIN 912.'
  }
};

function renderHome() {
  homeButton.classList.add('hidden');
  const tpl = document.getElementById('homeTemplate').content.cloneNode(true);
  app.replaceChildren(tpl);
  const grid = document.getElementById('toolGrid');
  const search = document.getElementById('toolSearch');

  const paint = (items) => {
    grid.replaceChildren(...items.map(tool => {
      const button = document.createElement('button');
      button.className = 'tool-card';
      button.type = 'button';
      button.innerHTML = `<span class="tool-icon">${tool.icon}</span><span><span class="tool-name">${tool.name}</span><span class="tool-desc">${tool.desc}</span></span>`;
      button.addEventListener('click', () => openTool(tool.id));
      return button;
    }));
  };

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    paint(tools.filter(t => `${t.name} ${t.desc}`.toLowerCase().includes(q)));
  });
  paint(tools);
}

function shell(title, subtitle, inner) {
  homeButton.classList.remove('hidden');
  app.innerHTML = `<button class="back" type="button">← Home</button><section class="panel"><h2>${title}</h2><p>${subtitle}</p>${inner}</section>`;
  app.querySelector('.back').addEventListener('click', renderHome);
}

function openTool(id) {
  if (id === 'keys') return renderKeys();
  if (id === 'converter') return renderConverter();

  const content = {
    alignment: ['Allineamento', 'Calcolo allineamento motore/pompa.', 'Il metodo di misura verrà configurato prima di inserire le formule: reverse dial, rim-face o laser.'],
    flanges: ['Flange', 'Quote e forature per norma.', 'Database previsto per EN/DIN, ASME e JIS con norma/revisione sempre visibile.'],
    pipes: ['Tubazioni', 'DN, NPS, diametri e Schedule.', 'Ricerca diretta e inversa dal diametro misurato.'],
    threads: ['Filettature', 'Metrica, BSP, NPT, UNC e UNF.', 'Passo, TPI, preforo e geometria verranno mantenuti distinti per standard.'],
    tolerances: ['Tolleranze', 'Accoppiamenti albero/foro.', 'Modulo previsto per tolleranze e accoppiamenti, con indicazione della norma di riferimento.'],
    weights: ['Pesi e geometria', 'Calcoli rapidi di officina e cantiere.', 'Piastre, tubi, profili, volumi e geometria saranno disponibili come moduli indipendenti.']
  }[id];

  shell(content[0], content[1], `<div class="note">${content[2]}</div><div class="section-list"><div class="section-row"><b>Stato modulo</b><span>Struttura pronta · dati tecnici da validare</span></div></div>`);
}

function renderKeys() {
  shell('Chiavi e bulloneria', 'Ricerca rapida metrica, anche al contrario.', `
    <div class="mode-switch" role="group" aria-label="Modalità ricerca">
      <button class="mode-button active" data-mode="thread" type="button">Da filetto</button>
      <button class="mode-button" data-mode="key" type="button">Da chiave</button>
    </div>

    <div class="field">
      <label for="fastenerType">Tipo / norma</label>
      <select id="fastenerType">
        <option value="isoHex">${fastenerTypes.isoHex.label}</option>
        <option value="dinHex">${fastenerTypes.dinHex.label}</option>
        <option value="socket">${fastenerTypes.socket.label}</option>
      </select>
    </div>

    <div id="threadSearch">
      <div class="field">
        <label for="threadSize">Filetto metrico</label>
        <select id="threadSize"></select>
      </div>
      <div class="quick-sizes" id="quickSizes"></div>
    </div>

    <div id="keySearch" class="hidden">
      <div class="field">
        <label for="keySize">Misura chiave [mm]</label>
        <input id="keySize" type="number" step="0.5" min="1" inputmode="decimal" placeholder="es. 17">
      </div>
    </div>

    <div id="boltResult" class="bolt-result"></div>

    <details class="references">
      <summary>Riferimenti tecnici</summary>
      <p>Teste esagonali: ISO 4014/4017 e confronto con DIN 931/933 legacy. Brugole: ISO 4762 / DIN 912. Passo grosso: ISO 262. Preforo di maschiatura: valori tecnici di riferimento per filetti metrici grossi.</p>
      <p>Le norme e le serie sono mantenute separate: non viene proposta automaticamente una misura DIN come equivalente ISO.</p>
    </details>
  `);

  const typeSelect = document.getElementById('fastenerType');
  const threadSize = document.getElementById('threadSize');
  const keySize = document.getElementById('keySize');
  const result = document.getElementById('boltResult');
  const quickSizes = document.getElementById('quickSizes');
  const threadSearch = document.getElementById('threadSearch');
  const keySearch = document.getElementById('keySearch');
  const modeButtons = [...app.querySelectorAll('.mode-button')];

  let mode = 'thread';

  function keyFor(size, type) {
    return metricThreads[size]?.[type];
  }

  function availableSizes(type) {
    return Object.keys(metricThreads).filter(size => Number.isFinite(keyFor(size, type)));
  }

  function populateSizes() {
    const sizes = availableSizes(typeSelect.value);
    const previous = threadSize.value;
    threadSize.innerHTML = sizes.map(size => `<option value="${size}">${size}</option>`).join('');
    threadSize.value = sizes.includes(previous) ? previous : (sizes.includes('M12') ? 'M12' : sizes[0]);

    const favorites = ['M6', 'M8', 'M10', 'M12', 'M16', 'M20', 'M24'].filter(s => sizes.includes(s));
    quickSizes.innerHTML = favorites.map(size => `<button type="button" class="size-chip" data-size="${size}">${size}</button>`).join('');
    quickSizes.querySelectorAll('.size-chip').forEach(button => {
      button.addEventListener('click', () => {
        threadSize.value = button.dataset.size;
        renderThreadResult();
      });
    });
  }

  function renderThreadResult() {
    const type = typeSelect.value;
    const size = threadSize.value;
    const row = metricThreads[size];
    const key = keyFor(size, type);
    if (!row || !Number.isFinite(key)) {
      result.innerHTML = '<div class="empty-result">Nessun dato disponibile.</div>';
      return;
    }

    const legacyDiff = (type === 'isoHex' && row.dinHex !== row.isoHex)
      ? `<div class="warning-line">DIN legacy per ${size}: <b>${row.dinHex} mm</b></div>`
      : (type === 'dinHex' && row.dinHex !== row.isoHex)
        ? `<div class="warning-line">ISO corrente per ${size}: <b>${row.isoHex} mm</b></div>`
        : '';

    result.innerHTML = `
      <div class="hero-result">
        <span>${fastenerTypes[type].keyLabel}</span>
        <strong>${key} mm</strong>
        <em>${size}</em>
      </div>
      ${legacyDiff}
      <div class="result-grid">
        <div><span>Passo grosso</span><b>${fmt(row.pitch)} mm</b></div>
        <div><span>Preforo maschio</span><b>${fmt(row.tap)} mm</b></div>
        <div class="wide"><span>Norma selezionata</span><b>${fastenerTypes[type].label}</b></div>
      </div>
      <div class="result-note">${fastenerTypes[type].note}</div>
    `;
  }

  function renderKeyResult() {
    const type = typeSelect.value;
    const value = Number(keySize.value);
    if (!Number.isFinite(value) || keySize.value === '') {
      result.innerHTML = '<div class="empty-result">Inserisci la misura della chiave.</div>';
      return;
    }

    const matches = availableSizes(type).filter(size => keyFor(size, type) === value);
    if (!matches.length) {
      const all = availableSizes(type)
        .map(size => ({ size, key: keyFor(size, type) }))
        .sort((a, b) => Math.abs(a.key - value) - Math.abs(b.key - value));
      const nearest = all.slice(0, 2);
      result.innerHTML = `
        <div class="empty-result">Nessuna corrispondenza esatta per <b>${fmt(value)} mm</b>.</div>
        <div class="nearest">Più vicine: ${nearest.map(x => `${x.size} → ${x.key} mm`).join(' · ')}</div>
      `;
      return;
    }

    result.innerHTML = `
      <div class="hero-result">
        <span>Corrispondenza</span>
        <strong>${matches.join(' / ')}</strong>
        <em>chiave ${fmt(value)} mm</em>
      </div>
      <div class="result-grid">
        ${matches.map(size => {
          const row = metricThreads[size];
          return `<div><span>${size}</span><b>Passo ${fmt(row.pitch)} mm</b></div>`;
        }).join('')}
        <div class="wide"><span>Norma selezionata</span><b>${fastenerTypes[type].label}</b></div>
      </div>
      <div class="result-note">${fastenerTypes[type].note}</div>
    `;
  }

  function refresh() {
    populateSizes();
    mode === 'thread' ? renderThreadResult() : renderKeyResult();
  }

  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      mode = button.dataset.mode;
      modeButtons.forEach(b => b.classList.toggle('active', b === button));
      threadSearch.classList.toggle('hidden', mode !== 'thread');
      keySearch.classList.toggle('hidden', mode !== 'key');
      mode === 'thread' ? renderThreadResult() : renderKeyResult();
    });
  });

  typeSelect.addEventListener('change', refresh);
  threadSize.addEventListener('change', renderThreadResult);
  keySize.addEventListener('input', renderKeyResult);

  refresh();
}

function fmt(value) {
  return Number.isInteger(Number(value)) ? String(Number(value)) : String(Number(value)).replace('.', ',');
}

function renderConverter() {
  shell('Conversioni', 'Convertitore tecnico disponibile offline.', `
    <div class="field"><label for="convType">Conversione</label><select id="convType">
      <option value="mm-in">mm → inch</option><option value="in-mm">inch → mm</option>
      <option value="bar-psi">bar → psi</option><option value="psi-bar">psi → bar</option>
      <option value="kw-hp">kW → HP</option><option value="hp-kw">HP → kW</option>
    </select></div>
    <div class="field"><label for="convValue">Valore</label><input id="convValue" inputmode="decimal" type="number" step="any" placeholder="Inserisci un valore"></div>
    <div class="result"><span>Risultato</span><strong id="convResult">—</strong></div>
  `);

  const type = document.getElementById('convType');
  const value = document.getElementById('convValue');
  const result = document.getElementById('convResult');
  const conversions = {
    'mm-in': [v => v / 25.4, ' in'], 'in-mm': [v => v * 25.4, ' mm'],
    'bar-psi': [v => v * 14.5037738, ' psi'], 'psi-bar': [v => v / 14.5037738, ' bar'],
    'kw-hp': [v => v * 1.34102209, ' HP'], 'hp-kw': [v => v / 1.34102209, ' kW']
  };
  const calc = () => {
    const v = Number(value.value);
    if (!Number.isFinite(v) || value.value === '') return result.textContent = '—';
    const [fn, unit] = conversions[type.value];
    result.textContent = `${Number(fn(v).toFixed(5))}${unit}`;
  };
  type.addEventListener('change', calc); value.addEventListener('input', calc);
}

homeButton.addEventListener('click', renderHome);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
renderHome();
