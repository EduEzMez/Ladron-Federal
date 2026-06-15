// =============================================================================
// ProvinceMapSVG — Mapa SVG 2D de Argentina con forma geográfica real
// ViewBox 0 0 510 800. Coordenadas derivadas de lat/lng reales.
// =============================================================================

export const PROVINCES_SVG = {
  jujuy:               { path: `M 196.6,7.1 L 271.8,7.1 L 271.8,11.8 L 262.1,40.0 L 225.7,49.4 L 191.7,35.3 L 167.5,18.8 L 160.2,11.8 Z`, cx: 218, cy: 28, name: "Jujuy" },
  salta:               { path: `M 271.8,7.1 L 298.5,9.4 L 330.1,9.4 L 330.1,35.3 L 293.7,80.0 L 262.1,80.0 L 230.6,80.0 L 230.6,54.1 L 225.7,49.4 L 262.1,40.0 L 271.8,11.8 Z`, cx: 278, cy: 50, name: "Salta" },
  formosa:             { path: `M 298.5,9.4 L 378.6,9.4 L 388.3,16.5 L 388.3,42.4 L 322.8,42.4 L 293.7,80.0 L 330.1,35.3 L 330.1,9.4 Z`, cx: 352, cy: 36, name: "Formosa" },
  misiones:            { path: `M 378.6,101.2 L 439.3,101.2 L 487.9,115.3 L 487.9,134.1 L 483.0,155.3 L 439.3,152.9 L 385.9,129.4 L 378.6,112.9 Z`, cx: 436, cy: 128, name: "Misiones" },
  chaco:               { path: `M 378.6,9.4 L 388.3,9.4 L 388.3,16.5 L 388.3,42.4 L 322.8,42.4 L 293.7,80.0 L 298.5,101.2 L 335.0,101.2 L 378.6,101.2 L 378.6,112.9 L 378.6,9.4 Z`, cx: 353, cy: 68, name: "Chaco" },
  tucuman:             { path: `M 189.3,108.2 L 230.6,98.8 L 230.6,80.0 L 201.5,75.3 L 191.7,80.0 L 177.2,89.4 L 177.2,117.6 L 189.3,117.6 Z`, cx: 207, cy: 96, name: "Tucumán" },
  santiago_del_estero: { path: `M 262.1,80.0 L 293.7,80.0 L 322.8,42.4 L 335.0,101.2 L 286.4,157.6 L 245.1,157.6 L 230.6,141.2 L 230.6,98.8 L 230.6,80.0 Z`, cx: 278, cy: 112, name: "Santiago del Estero" },
  catamarca:           { path: `M 191.7,35.3 L 225.7,49.4 L 230.6,54.1 L 230.6,80.0 L 201.5,75.3 L 191.7,80.0 L 152.9,94.1 L 128.6,117.6 L 152.9,141.2 L 177.2,152.9 L 177.2,117.6 L 177.2,89.4 L 191.7,80.0 L 177.2,58.8 L 167.5,18.8 Z`, cx: 180, cy: 88, name: "Catamarca" },
  corrientes:          { path: `M 385.9,129.4 L 439.3,152.9 L 483.0,155.3 L 483.0,188.2 L 395.6,211.8 L 371.4,211.8 L 371.4,164.7 L 385.9,148.2 Z`, cx: 422, cy: 170, name: "Corrientes" },
  entre_rios:          { path: `M 371.4,211.8 L 395.6,211.8 L 395.6,294.1 L 378.6,294.1 L 354.4,287.1 L 322.8,240.0 L 322.8,211.8 Z`, cx: 365, cy: 252, name: "Entre Ríos" },
  la_rioja:            { path: `M 177.2,117.6 L 177.2,152.9 L 152.9,141.2 L 128.6,117.6 L 92.2,169.4 L 128.6,197.6 L 152.9,197.6 L 177.2,204.7 L 189.3,164.7 L 189.3,117.6 Z`, cx: 150, cy: 162, name: "La Rioja" },
  san_juan:            { path: `M 177.2,152.9 L 152.9,197.6 L 128.6,197.6 L 104.4,197.6 L 75.2,211.8 L 75.2,254.1 L 104.4,254.1 L 140.8,254.1 L 140.8,211.8 L 152.9,197.6 L 177.2,152.9 Z`, cx: 120, cy: 208, name: "San Juan" },
  cordoba:             { path: `M 245.1,157.6 L 286.4,157.6 L 335.0,101.2 L 335.0,176.5 L 298.5,235.3 L 262.1,294.1 L 225.7,294.1 L 201.5,282.4 L 189.3,258.8 L 189.3,204.7 L 177.2,204.7 L 177.2,152.9 L 245.1,157.6 Z`, cx: 258, cy: 210, name: "Córdoba" },
  santa_fe:            { path: `M 335.0,101.2 L 378.6,101.2 L 378.6,112.9 L 385.9,148.2 L 385.9,164.7 L 371.4,164.7 L 371.4,211.8 L 322.8,211.8 L 322.8,240.0 L 298.5,235.3 L 335.0,176.5 L 335.0,101.2 Z`, cx: 348, cy: 174, name: "Santa Fe" },
  mendoza:             { path: `M 189.3,258.8 L 189.3,204.7 L 177.2,204.7 L 152.9,197.6 L 140.8,211.8 L 104.4,254.1 L 75.2,254.1 L 75.2,324.7 L 128.6,329.4 L 152.9,312.9 L 177.2,305.9 L 189.3,282.4 Z`, cx: 128, cy: 268, name: "Mendoza" },
  san_luis:            { path: `M 201.5,282.4 L 189.3,282.4 L 177.2,305.9 L 152.9,312.9 L 128.6,329.4 L 140.8,334.1 L 201.5,329.4 Z`, cx: 170, cy: 308, name: "San Luis" },
  buenos_aires:        { path: `M 322.8,211.8 L 322.8,240.0 L 354.4,287.1 L 378.6,294.1 L 395.6,294.1 L 395.6,329.4 L 407.8,357.6 L 390.8,388.2 L 371.4,400.0 L 335.0,423.5 L 286.4,451.8 L 213.6,447.1 L 213.6,388.2 L 250.0,371.8 L 267.0,352.9 L 262.1,294.1 L 298.5,235.3 Z`, cx: 320, cy: 340, name: "Buenos Aires" },
  caba:                { path: `M 368,300 L 376,300 L 376,310 L 368,310 Z`, cx: 385, cy: 296, name: "CABA" },
  la_pampa:            { path: `M 262.1,294.1 L 267.0,352.9 L 250.0,371.8 L 213.6,388.2 L 165.0,400.0 L 128.6,352.9 L 140.8,334.1 L 128.6,329.4 L 75.2,324.7 L 128.6,329.4 L 152.9,312.9 L 177.2,305.9 L 189.3,282.4 L 201.5,282.4 L 201.5,329.4 L 225.7,294.1 Z`, cx: 195, cy: 345, name: "La Pampa" },
  neuquen:             { path: `M 128.6,352.9 L 165.0,341.2 L 165.0,400.0 L 92.2,400.0 L 55.8,400.0 L 55.8,364.7 L 55.8,341.2 L 75.2,324.7 L 128.6,329.4 L 140.8,334.1 Z`, cx: 108, cy: 368, name: "Neuquén" },
  rio_negro:           { path: `M 165.0,400.0 L 213.6,388.2 L 250.0,371.8 L 267.0,352.9 L 213.6,447.1 L 286.4,451.8 L 274.3,470.6 L 213.6,482.4 L 152.9,482.4 L 55.8,482.4 L 55.8,447.1 L 55.8,400.0 L 92.2,400.0 Z`, cx: 168, cy: 435, name: "Río Negro" },
  chubut:              { path: `M 213.6,482.4 L 274.3,470.6 L 286.4,451.8 L 378.6,470.6 L 262.1,517.6 L 201.5,569.4 L 152.9,588.2 L 55.8,564.7 L 55.8,482.4 L 152.9,482.4 Z`, cx: 180, cy: 520, name: "Chubut" },
  santa_cruz:          { path: `M 201.5,569.4 L 262.1,517.6 L 378.6,470.6 L 383.5,576.5 L 201.5,670.6 L 92.2,717.6 L 31.6,705.9 L 31.6,611.8 L 55.8,600.0 L 55.8,564.7 L 152.9,588.2 Z`, cx: 172, cy: 618, name: "Santa Cruz" },
  tierra_del_fuego:    { path: `M 194.2,717.6 L 262.1,717.6 L 262.1,785.9 L 225.7,790.6 L 177.2,788.2 L 128.6,776.5 L 128.6,729.4 L 177.2,717.6 Z`, cx: 198, cy: 752, name: "Tierra del Fuego" },
};

// ── Colores por estado ────────────────────────────────────────────────────────
const COLOR = {
  current:   '#E63946',
  visited:   '#06D6A0',
  available: '#118AB2',
  inactive:  '#C8D9E6',
  stroke:    '#ffffff',
};
const TEXT_COLOR = {
  current:   '#fff',
  visited:   '#fff',
  available: '#fff',
  inactive:  '#5E7A8A',
};

// Tamaño de fuente según provincia (algunas son chicas)
const FONT_SIZE = {
  tucuman: 7, caba: 6, entre_rios: 7, corrientes: 7,
  misiones: 6, jujuy: 7, la_rioja: 7, san_juan: 7,
  san_luis: 7, formosa: 7,
};

export class ProvinceMapSVG {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this._tooltip = null;
  }

  render() {
    const { currentProvinceId, visitedProvinces = [], availableProvinces = [], onSelect } = this.options;
    const visitedSet   = new Set(visitedProvinces);
    const availableSet = new Set(availableProvinces);

    const NS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 510 800');
    svg.setAttribute('xmlns', NS);
    svg.style.cssText = 'width:100%;height:100%;display:block;touch-action:manipulation;';
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Mapa de Argentina — seleccioná una provincia');

    // Océano
    const bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('width', '510'); bg.setAttribute('height', '800');
    bg.setAttribute('fill', '#BEE3F8');
    svg.appendChild(bg);

    const g = document.createElementNS(NS, 'g');

    Object.entries(PROVINCES_SVG).forEach(([id, prov]) => {
      const isCurrent   = id === currentProvinceId;
      const isVisited   = visitedSet.has(id) && !isCurrent;
      const isAvailable = availableSet.has(id) && !isCurrent && !isVisited;
      const state = isCurrent ? 'current' : isVisited ? 'visited' : isAvailable ? 'available' : 'inactive';
      const clickable = state !== 'inactive';

      // Path
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', prov.path);
      path.setAttribute('fill', COLOR[state]);
      path.setAttribute('stroke', COLOR.stroke);
      path.setAttribute('stroke-width', id === 'caba' ? '1' : '1.5');
      path.setAttribute('stroke-linejoin', 'round');
      path.style.cursor = clickable ? 'pointer' : 'default';
      path.style.transition = 'filter 0.12s';

      if (clickable) {
        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'button');
        path.setAttribute('aria-label', prov.name);
        path.addEventListener('mouseenter', () => {
          path.style.filter = 'brightness(1.18) drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
          this._showTip(prov.name, id === currentProvinceId ? '📍 Estás acá' : '');
        });
        path.addEventListener('mouseleave', () => {
          path.style.filter = '';
          this._hideTip();
        });
        path.addEventListener('click', (e) => { e.stopPropagation(); onSelect?.(id); });
        path.addEventListener('touchend', (e) => { e.preventDefault(); onSelect?.(id); });
        path.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(id); }
        });
      }

      g.appendChild(path);

      // Label (solo si no es muy chica)
      if (id !== 'caba') {
        const fs = FONT_SIZE[id] ?? 9;

        // Sombra de texto (legibilidad)
        const shadow = document.createElementNS(NS, 'text');
        shadow.setAttribute('x', prov.cx);
        shadow.setAttribute('y', prov.cy + 4);
        shadow.setAttribute('text-anchor', 'middle');
        shadow.setAttribute('font-family', 'Nunito, sans-serif');
        shadow.setAttribute('font-weight', '800');
        shadow.setAttribute('font-size', fs);
        shadow.setAttribute('fill', 'none');
        shadow.setAttribute('stroke', 'rgba(0,0,0,0.4)');
        shadow.setAttribute('stroke-width', '3');
        shadow.setAttribute('stroke-linejoin', 'round');
        shadow.setAttribute('pointer-events', 'none');
        shadow.textContent = prov.name;
        g.appendChild(shadow);

        const label = document.createElementNS(NS, 'text');
        label.setAttribute('x', prov.cx);
        label.setAttribute('y', prov.cy + 4);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-family', 'Nunito, sans-serif');
        label.setAttribute('font-weight', '800');
        label.setAttribute('font-size', fs);
        label.setAttribute('fill', TEXT_COLOR[state]);
        label.setAttribute('pointer-events', 'none');
        label.textContent = prov.name;
        g.appendChild(label);
      }

      // Ícono "estás acá"
      if (isCurrent) {
        const pin = document.createElementNS(NS, 'circle');
        pin.setAttribute('cx', prov.cx);
        pin.setAttribute('cy', prov.cy - 14);
        pin.setAttribute('r', '7');
        pin.setAttribute('fill', '#fff');
        pin.setAttribute('stroke', COLOR.current);
        pin.setAttribute('stroke-width', '2.5');
        pin.setAttribute('pointer-events', 'none');
        g.appendChild(pin);

        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', prov.cx);
        dot.setAttribute('cy', prov.cy - 14);
        dot.setAttribute('r', '3.5');
        dot.setAttribute('fill', COLOR.current);
        dot.setAttribute('pointer-events', 'none');
        g.appendChild(dot);
      }
    });

    svg.appendChild(g);

    // Tooltip
    this._tooltip = document.createElement('div');
    Object.assign(this._tooltip.style, {
      position: 'fixed', zIndex: '200', display: 'none',
      background: '#1A1F2C', color: '#fff',
      padding: '5px 12px', borderRadius: '8px',
      fontSize: '13px', fontWeight: '700',
      pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      whiteSpace: 'nowrap',
    });
    document.body.appendChild(this._tooltip);

    svg.addEventListener('mousemove', (e) => {
      if (this._tooltip.style.display === 'block') {
        this._tooltip.style.left = (e.clientX - this._tooltip.offsetWidth / 2) + 'px';
        this._tooltip.style.top  = (e.clientY - 42) + 'px';
      }
    });

    this.container.innerHTML = '';
    this.container.appendChild(svg);
  }

  update(options) {
    Object.assign(this.options, options);
    this.render();
  }

  _showTip(name, sub) {
    this._tooltip.textContent = sub ? `${name} · ${sub}` : name;
    this._tooltip.style.display = 'block';
  }

  _hideTip() { this._tooltip.style.display = 'none'; }

  destroy() {
    this._tooltip?.remove();
    this.container.innerHTML = '';
  }
}
