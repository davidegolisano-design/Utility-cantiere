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
  if (id === 'converter') return renderConverter();

  const content = {
    alignment: ['Allineamento', 'Calcolo allineamento motore/pompa.', 'Il metodo di misura verrà configurato prima di inserire le formule: reverse dial, rim-face o laser.'],
    keys: ['Chiavi e bulloneria', 'Ricerca rapida per vite, dado e utensile.', 'Le tabelle saranno separate per norma: niente equivalenze ambigue tra DIN/ISO e serie in pollici.'],
    flanges: ['Flange', 'Quote e forature per norma.', 'Database previsto per EN/DIN, ASME e JIS con norma/revisione sempre visibile.'],
    pipes: ['Tubazioni', 'DN, NPS, diametri e Schedule.', 'Ricerca diretta e inversa dal diametro misurato.'],
    threads: ['Filettature', 'Metrica, BSP, NPT, UNC e UNF.', 'Passo, TPI, preforo e geometria verranno mantenuti distinti per standard.'],
    tolerances: ['Tolleranze', 'Accoppiamenti albero/foro.', 'Modulo previsto per tolleranze e accoppiamenti, con indicazione della norma di riferimento.'],
    weights: ['Pesi e geometria', 'Calcoli rapidi di officina e cantiere.', 'Piastre, tubi, profili, volumi e geometria saranno disponibili come moduli indipendenti.']
  }[id];

  shell(content[0], content[1], `<div class="note">${content[2]}</div><div class="section-list"><div class="section-row"><b>Stato modulo</b><span>Struttura pronta · dati tecnici da validare</span></div></div>`);
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
