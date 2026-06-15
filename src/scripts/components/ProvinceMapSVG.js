// =============================================================================
// ProvinceMapSVG — Mapa SVG 2D de Argentina
// Reemplaza el mapa Three.js por un SVG responsivo con paths geográficos reales.
// Colorea provincias por estado: actual (rojo), visitada (verde), disponible (azul),
// inactiva (gris). Click/tap para seleccionar. Tooltip con nombre.
// =============================================================================

const PROVINCES_SVG = {
  jujuy:               { path: "M 195.0,6.2 L 265.0,6.2 L 265.0,35.0 L 237.5,45.3 L 195.0,41.2 L 167.5,20.6 L 182.5,6.2 Z", cx: 220, cy: 25, name: "Jujuy" },
  salta:               { path: "M 265.0,6.2 L 300.0,10.3 L 300.0,72.1 L 262.5,78.2 L 230.0,78.2 L 230.0,51.5 L 195.0,41.2 L 237.5,45.3 L 265.0,35.0 Z", cx: 255, cy: 48, name: "Salta" },
  formosa:             { path: "M 300.0,10.3 L 382.5,10.3 L 382.5,37.1 L 325.0,37.1 L 300.0,72.1 Z", cx: 342, cy: 34, name: "Formosa" },
  misiones:            { path: "M 382.5,86.5 L 492.5,86.5 L 492.5,133.8 L 442.5,133.8 L 382.5,113.2 Z", cx: 438, cy: 110, name: "Misiones" },
  chaco:               { path: "M 382.5,10.3 L 382.5,86.5 L 300.0,86.5 L 300.0,72.1 L 325.0,37.1 L 382.5,37.1 Z", cx: 347, cy: 56, name: "Chaco" },
  tucuman:             { path: "M 195.0,92.6 L 230.0,78.2 L 212.5,92.6 L 212.5,133.8 L 187.5,133.8 L 175.0,113.2 L 187.5,92.6 Z", cx: 202, cy: 107, name: "Tucumán" },
  santiago_del_estero: { path: "M 265.0,78.2 L 300.0,72.1 L 300.0,86.5 L 267.5,144.1 L 237.5,144.1 L 230.0,113.2 L 230.0,78.2 Z", cx: 263, cy: 104, name: "Santiago del Estero" },
  catamarca:           { path: "M 195.0,78.2 L 195.0,41.2 L 167.5,20.6 L 125.0,51.5 L 137.5,113.2 L 162.5,113.2 L 187.5,133.8 L 212.5,133.8 L 212.5,92.6 L 195.0,92.6 Z", cx: 175, cy: 88, name: "Catamarca" },
  corrientes:          { path: "M 400.0,117.4 L 400.0,185.3 L 367.5,185.3 L 350.0,133.8 L 382.5,113.2 L 442.5,133.8 Z", cx: 390, cy: 148, name: "Corrientes" },
  entre_rios:          { path: "M 400.0,185.3 L 400.0,257.4 L 362.5,257.4 L 325.0,205.9 L 362.5,185.3 Z", cx: 370, cy: 220, name: "Entre Ríos" },
  la_rioja:            { path: "M 187.5,133.8 L 162.5,113.2 L 137.5,113.2 L 100.0,144.1 L 125.0,175.0 L 150.0,175.0 L 175.0,175.0 L 187.5,154.4 Z", cx: 153, cy: 148, name: "La Rioja" },
  san_juan:            { path: "M 150.0,144.1 L 150.0,175.0 L 150.0,216.2 L 100.0,216.2 L 75.0,185.3 L 100.0,144.1 L 125.0,144.1 Z", cx: 118, cy: 178, name: "San Juan" },
  cordoba:             { path: "M 300.0,86.5 L 267.5,144.1 L 237.5,144.1 L 187.5,154.4 L 175.0,175.0 L 175.0,247.1 L 237.5,247.1 L 275.0,247.1 L 275.0,154.4 L 287.5,133.8 Z", cx: 238, cy: 176, name: "Córdoba" },
  santa_fe:            { path: "M 350.0,133.8 L 367.5,185.3 L 362.5,185.3 L 325.0,205.9 L 325.0,236.8 L 275.0,236.8 L 275.0,154.4 L 287.5,133.8 L 300.0,86.5 Z", cx: 320, cy: 170, name: "Santa Fe" },
  mendoza:             { path: "M 150.0,216.2 L 75.0,216.2 L 70.0,277.9 L 125.0,277.9 L 162.5,267.6 L 187.5,257.4 L 175.0,247.1 L 150.0,236.8 Z", cx: 133, cy: 252, name: "Mendoza" },
  san_luis:            { path: "M 175.0,247.1 L 175.0,175.0 L 150.0,175.0 L 150.0,236.8 L 162.5,267.6 L 187.5,257.4 Z", cx: 167, cy: 228, name: "San Luis" },
  buenos_aires:        { path: "M 325.0,236.8 L 325.0,205.9 L 362.5,257.4 L 400.0,257.4 L 400.0,308.8 L 350.0,329.4 L 300.0,350.0 L 262.5,391.2 L 225.0,380.9 L 212.5,350.0 L 262.5,319.1 L 275.0,308.8 L 275.0,247.1 L 237.5,247.1 L 275.0,236.8 Z", cx: 308, cy: 298, name: "Buenos Aires" },
  caba:                { path: "M 371.0,261.0 L 381.0,261.0 L 381.0,272.0 L 371.0,272.0 Z", cx: 376, cy: 266, name: "CABA" },
  la_pampa:            { path: "M 275.0,247.1 L 275.0,308.8 L 262.5,319.1 L 212.5,350.0 L 162.5,350.0 L 162.5,298.5 L 125.0,277.9 L 162.5,267.6 L 187.5,257.4 L 175.0,247.1 Z", cx: 205, cy: 295, name: "La Pampa" },
  neuquen:             { path: "M 162.5,298.5 L 162.5,350.0 L 87.5,350.0 L 62.5,319.1 L 62.5,298.5 L 70.0,277.9 L 125.0,277.9 Z", cx: 106, cy: 313, name: "Neuquén" },
  rio_negro:           { path: "M 162.5,350.0 L 212.5,350.0 L 262.5,391.2 L 262.5,411.8 L 212.5,422.1 L 162.5,422.1 L 87.5,422.1 L 50.0,391.2 L 62.5,350.0 L 87.5,350.0 Z", cx: 158, cy: 387, name: "Río Negro" },
  chubut:              { path: "M 212.5,422.1 L 262.5,411.8 L 262.5,452.9 L 200.0,504.4 L 162.5,504.4 L 50.0,483.8 L 50.0,422.1 L 87.5,422.1 L 162.5,422.1 Z", cx: 158, cy: 455, name: "Chubut" },
  santa_cruz:          { path: "M 200.0,504.4 L 262.5,452.9 L 262.5,545.6 L 200.0,586.8 L 100.0,627.9 L 25.0,617.6 L 25.0,545.6 L 50.0,525.0 L 50.0,483.8 L 162.5,504.4 Z", cx: 135, cy: 548, name: "Santa Cruz" },
  tierra_del_fuego:    { path: "M 200.0,627.9 L 137.5,627.9 L 125.0,679.4 L 200.0,689.7 L 250.0,669.1 L 262.5,638.2 L 200.0,627.9 Z", cx: 195, cy: 654, name: "Tierra del Fuego" },
};

// Colores por estado (iguales a la imagen de referencia)
const COLORS = {
  current:   '#E63946', // rojo — estás acá
  visited:   '#06D6A0', // verde — ya visitada
  available: '#118AB2', // azul — disponible para viajar
  inactive:  '#CBD5E1', // gris claro — no disponible aún
  hover:     '#FFD60A', // amarillo — hover/focus
};

const LABEL_COLORS = {
  current:   '#fff',
  visited:   '#fff',
  available: '#fff',
  inactive:  '#64748B',
};

export class ProvinceMapSVG {
  /**
   * @param {HTMLElement} container
   * @param {{
   *   currentProvinceId: string,
   *   visitedProvinces: string[],
   *   availableProvinces: string[],
   *   onSelect: (id: string) => void
   * }} options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this._tooltip = null;
    this._svg = null;
  }

  render() {
    const { currentProvinceId, visitedProvinces = [], availableProvinces = [], onSelect } = this.options;
    const visitedSet = new Set(visitedProvinces);
    const availableSet = new Set(availableProvinces);

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 510 710');
    svg.setAttribute('xmlns', svgNS);
    svg.style.cssText = 'width:100%;height:100%;display:block;';
    svg.setAttribute('aria-label', 'Mapa interactivo de Argentina');
    svg.setAttribute('role', 'img');
    this._svg = svg;

    // Fondo — océano estilizado
    const ocean = document.createElementNS(svgNS, 'rect');
    ocean.setAttribute('width', '510');
    ocean.setAttribute('height', '710');
    ocean.setAttribute('fill', '#E0F2FE');
    svg.appendChild(ocean);

    // Grupo de provincias
    const g = document.createElementNS(svgNS, 'g');

    Object.entries(PROVINCES_SVG).forEach(([id, prov]) => {
      const isCurrent   = id === currentProvinceId;
      const isVisited   = visitedSet.has(id) && !isCurrent;
      const isAvailable = availableSet.has(id) && !isCurrent && !isVisited;
      const isInactive  = !isCurrent && !isVisited && !isAvailable;

      const state = isCurrent ? 'current' : isVisited ? 'visited' : isAvailable ? 'available' : 'inactive';
      const fill = COLORS[state];
      const labelColor = LABEL_COLORS[state];
      const clickable = !isInactive;

      // Path
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', prov.path);
      path.setAttribute('fill', fill);
      path.setAttribute('stroke', '#fff');
      path.setAttribute('stroke-width', id === 'caba' ? '1' : '2');
      path.setAttribute('stroke-linejoin', 'round');
      path.style.cursor = clickable ? 'pointer' : 'default';
      path.style.transition = 'filter 0.15s ease';
      if (clickable) {
        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'button');
        path.setAttribute('aria-label', prov.name);

        path.addEventListener('mouseenter', () => {
          path.style.filter = 'brightness(1.2)';
          this._showTooltip(prov.name);
        });
        path.addEventListener('mouseleave', () => {
          path.style.filter = '';
          this._hideTooltip();
        });
        path.addEventListener('click', () => onSelect?.(id));
        path.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(id); }
        });
        path.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this._showTooltip(prov.name);
        }, { passive: false });
        path.addEventListener('touchend', (e) => {
          e.preventDefault();
          this._hideTooltip();
          onSelect?.(id);
        });
      }

      g.appendChild(path);

      // Etiqueta con nombre (solo provincias con área suficiente)
      if (id !== 'caba') {
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', prov.cx);
        text.setAttribute('y', prov.cy + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Nunito, system-ui, sans-serif');
        text.setAttribute('font-weight', '700');
        text.setAttribute('font-size', this._fontSize(id));
        text.setAttribute('fill', labelColor);
        text.setAttribute('pointer-events', 'none');
        text.setAttribute('paint-order', 'stroke');
        text.setAttribute('stroke', 'rgba(0,0,0,0.3)');
        text.setAttribute('stroke-width', '2');
        text.setAttribute('stroke-linejoin', 'round');
        text.textContent = prov.name;
        g.appendChild(text);
      }

      // Pin "estás acá"
      if (isCurrent) {
        const pin = document.createElementNS(svgNS, 'circle');
        pin.setAttribute('cx', prov.cx);
        pin.setAttribute('cy', prov.cy - 18);
        pin.setAttribute('r', '8');
        pin.setAttribute('fill', '#fff');
        pin.setAttribute('stroke', COLORS.current);
        pin.setAttribute('stroke-width', '3');
        g.appendChild(pin);

        const dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('cx', prov.cx);
        dot.setAttribute('cy', prov.cy - 18);
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', COLORS.current);
        g.appendChild(dot);
      }
    });

    svg.appendChild(g);

    // Tooltip
    this._tooltip = document.createElement('div');
    this._tooltip.className = 'province-tooltip';
    this._tooltip.style.display = 'none';
    this._tooltip.style.position = 'fixed';
    this._tooltip.style.zIndex = '200';
    this._tooltip.style.background = '#1A1F2C';
    this._tooltip.style.color = '#fff';
    this._tooltip.style.padding = '6px 12px';
    this._tooltip.style.borderRadius = '8px';
    this._tooltip.style.fontSize = '13px';
    this._tooltip.style.fontWeight = '700';
    this._tooltip.style.pointerEvents = 'none';
    this._tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    document.body.appendChild(this._tooltip);

    // Seguir el mouse
    svg.addEventListener('mousemove', (e) => {
      if (this._tooltip.style.display === 'block') {
        this._tooltip.style.left = (e.clientX - this._tooltip.offsetWidth / 2) + 'px';
        this._tooltip.style.top  = (e.clientY - 44) + 'px';
      }
    });

    this.container.innerHTML = '';
    this.container.appendChild(svg);
  }

  update(options) {
    this.options = { ...this.options, ...options };
    this.render();
  }

  _fontSize(id) {
    const small = ['tucuman','caba','san_luis','entre_rios','corrientes','la_rioja','san_juan','jujuy','formosa'];
    const xsmall = ['misiones'];
    if (xsmall.includes(id)) return '7';
    if (small.includes(id)) return '8';
    return '9';
  }

  _showTooltip(name) {
    this._tooltip.textContent = name;
    this._tooltip.style.display = 'block';
  }

  _hideTooltip() {
    this._tooltip.style.display = 'none';
  }

  destroy() {
    this._tooltip?.remove();
    this._tooltip = null;
    this.container.innerHTML = '';
  }
}
