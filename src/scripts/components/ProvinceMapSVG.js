// =============================================================================
// ProvinceMapSVG — Mapa de Argentina real con pines de selección
// Usa la imagen mapa-argentina.png como fondo y dibuja círculos interactivos
// encima de cada provincia. Sin SVG paths complejos: forma real garantizada.
// =============================================================================

// Coordenadas (x,y) de cada pin en la imagen 351×740px
const PROVINCE_PINS = {
  jujuy:               { x: 130, y:  54, name: "Jujuy" },
  salta:               { x: 157, y:  90, name: "Salta" },
  formosa:             { x: 225, y:  72, name: "Formosa" },
  misiones:            { x: 292, y: 138, name: "Misiones" },
  chaco:               { x: 210, y: 118, name: "Chaco" },
  tucuman:             { x: 136, y: 132, name: "Tucumán" },
  santiago_del_estero: { x: 190, y: 150, name: "Santiago del Estero" },
  catamarca:           { x: 112, y: 145, name: "Catamarca" },
  corrientes:          { x: 256, y: 172, name: "Corrientes" },
  entre_rios:          { x: 238, y: 230, name: "Entre Ríos" },
  la_rioja:            { x: 110, y: 182, name: "La Rioja" },
  san_juan:            { x:  90, y: 215, name: "San Juan" },
  cordoba:             { x: 162, y: 222, name: "Córdoba" },
  santa_fe:            { x: 210, y: 200, name: "Santa Fe" },
  mendoza:             { x:  88, y: 272, name: "Mendoza" },
  san_luis:            { x: 132, y: 262, name: "San Luis" },
  buenos_aires:        { x: 210, y: 320, name: "Buenos Aires" },
  caba:                { x: 244, y: 283, name: "CABA" },
  la_pampa:            { x: 138, y: 330, name: "La Pampa" },
  neuquen:             { x:  68, y: 360, name: "Neuquén" },
  rio_negro:           { x: 108, y: 402, name: "Río Negro" },
  chubut:              { x: 106, y: 480, name: "Chubut" },
  santa_cruz:          { x:  90, y: 578, name: "Santa Cruz" },
  tierra_del_fuego:    { x: 120, y: 668, name: "Tierra del Fuego" },
};

const COLOR = {
  current:   '#E63946',
  visited:   '#06D6A0',
  available: '#FFD60A',
  inactive:  'rgba(255,255,255,0.25)',
};
const STROKE = {
  current:   '#fff',
  visited:   '#fff',
  available: '#1A1F2C',
  inactive:  'rgba(255,255,255,0.4)',
};
const RADIUS = {
  current:   14,
  visited:   11,
  available: 12,
  inactive:   7,
};

export class ProvinceMapSVG {
  constructor(container, options = {}) {
    this.container = container;
    this.options   = options;
    this._tooltip  = null;
    this._wrap     = null;
  }

  render() {
    const {
      currentProvinceId,
      visitedProvinces  = [],
      availableProvinces = [],
      onSelect,
    } = this.options;

    const visitedSet   = new Set(visitedProvinces);
    const availableSet = new Set(availableProvinces);

    // Wrapper relativo para posicionar pines encima de la imagen
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:100%;height:100%;';
    this._wrap = wrap;

    // Imagen de fondo (mapa real de Argentina)
    const img = document.createElement('img');
    img.src = 'assets/mapa-argentina.png';
    img.alt = 'Mapa de Argentina';
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;user-select:none;pointer-events:none;';
    img.draggable = false;
    wrap.appendChild(img);

    // Overlay SVG para pines (mismo tamaño que la imagen)
    const NS  = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    // viewBox basado en dimensiones originales de la imagen (351x740)
    svg.setAttribute('viewBox', '0 0 351 740');
    svg.setAttribute('xmlns', NS);
    svg.style.cssText = `
      position:absolute;top:0;left:0;
      width:100%;height:100%;
      overflow:visible;
    `;
    svg.setAttribute('aria-label', 'Seleccioná una provincia');

    Object.entries(PROVINCE_PINS).forEach(([id, pin]) => {
      const isCurrent   = id === currentProvinceId;
      const isVisited   = visitedSet.has(id) && !isCurrent;
      const isAvailable = availableSet.has(id) && !isCurrent && !isVisited;
      const state       = isCurrent ? 'current' : isVisited ? 'visited' : isAvailable ? 'available' : 'inactive';
      const clickable   = state !== 'inactive';
      const r           = RADIUS[state];

      const g = document.createElementNS(NS, 'g');
      g.setAttribute('data-id', id);
      if (clickable) {
        g.style.cursor = 'pointer';
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', pin.name);
      }

      // Sombra suave
      const shadow = document.createElementNS(NS, 'circle');
      shadow.setAttribute('cx', pin.x + 1);
      shadow.setAttribute('cy', pin.y + 2);
      shadow.setAttribute('r',  r);
      shadow.setAttribute('fill', 'rgba(0,0,0,0.25)');
      shadow.setAttribute('pointer-events', 'none');
      g.appendChild(shadow);

      // Círculo principal
      const circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('cx', pin.x);
      circle.setAttribute('cy', pin.y);
      circle.setAttribute('r',  r);
      circle.setAttribute('fill', COLOR[state]);
      circle.setAttribute('stroke', STROKE[state]);
      circle.setAttribute('stroke-width', isCurrent ? '3' : '2');
      circle.style.transition = 'r 0.12s, filter 0.12s';
      g.appendChild(circle);

      // Ícono estás acá
      if (isCurrent) {
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', pin.x);
        dot.setAttribute('cy', pin.y);
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', '#fff');
        dot.setAttribute('pointer-events', 'none');
        g.appendChild(dot);
      }

      // Etiqueta — solo provincias con enough space (evita solapamiento)
      const skipLabel = new Set(['caba','tucuman','misiones','la_rioja','san_juan','san_luis','entre_rios']);
      if (!skipLabel.has(id) && state !== 'inactive') {
        const label = document.createElementNS(NS, 'text');
        label.setAttribute('x', pin.x);
        label.setAttribute('y', pin.y + r + 9);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-family', 'Nunito, sans-serif');
        label.setAttribute('font-weight', '800');
        label.setAttribute('font-size', '7.5');
        label.setAttribute('fill', '#1A1F2C');
        label.setAttribute('paint-order', 'stroke');
        label.setAttribute('stroke', '#fff');
        label.setAttribute('stroke-width', '2.5');
        label.setAttribute('stroke-linejoin', 'round');
        label.setAttribute('pointer-events', 'none');
        label.textContent = pin.name;
        g.appendChild(label);
      }

      // Interacción
      if (clickable) {
        g.addEventListener('mouseenter', () => {
          circle.setAttribute('r', r + 3);
          circle.style.filter = 'brightness(1.15)';
          this._showTip(pin.name);
        });
        g.addEventListener('mouseleave', () => {
          circle.setAttribute('r', r);
          circle.style.filter = '';
          this._hideTip();
        });
        g.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelect?.(id);
        });
        g.addEventListener('touchend', (e) => {
          e.preventDefault();
          onSelect?.(id);
        });
        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.(id);
          }
        });
      }

      svg.appendChild(g);
    });

    wrap.appendChild(svg);

    // Tooltip
    this._tooltip = document.createElement('div');
    Object.assign(this._tooltip.style, {
      position: 'fixed', zIndex: '201', display: 'none',
      background: '#1A1F2C', color: '#fff',
      padding: '4px 12px', borderRadius: '8px',
      fontSize: '13px', fontWeight: '700',
      pointerEvents: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
      whiteSpace: 'nowrap',
      transform: 'translate(-50%, -110%)',
    });
    document.body.appendChild(this._tooltip);

    wrap.addEventListener('mousemove', (e) => {
      if (this._tooltip.style.display === 'block') {
        this._tooltip.style.left = e.clientX + 'px';
        this._tooltip.style.top  = e.clientY + 'px';
      }
    });

    this.container.innerHTML = '';
    this.container.appendChild(wrap);
  }

  update(options) {
    Object.assign(this.options, options);
    this.render();
  }

  _showTip(name) {
    this._tooltip.textContent = name;
    this._tooltip.style.display = 'block';
  }
  _hideTip() { this._tooltip.style.display = 'none'; }

  destroy() {
    this._tooltip?.remove();
    this.container.innerHTML = '';
  }
}
