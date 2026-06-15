// =============================================================================
// BASE SCENE
// Provee infraestructura común: HUD persistente, manejo del cuaderno,
// utilidades de creación de elementos.
// =============================================================================

import { HUD } from '../components/HUD.js';
import { Notebook } from '../components/Notebook.js';

export class BaseScene {
  constructor({ showHud = true } = {}) {
    this.showHud = showHud;
    this.hud = null;
    this.notebook = null;
    this.container = null;
    this.ctx = null;
  }

  async mount(container, context, payload) {
    this.container = container;
    this.ctx = context;
    this.payload = payload;

    if (this.showHud) {
      this.hud = new HUD(context);
      this.hud.mount(container);
    }

    this.notebook = new Notebook(context);
    this.notebook.mount();

    this.body = document.createElement('main');
    this.body.className = 'scene-body';
    container.appendChild(this.body);

    await this.onMount(this.body, context, payload);
  }

  async onMount() { /* override */ }
  async onUnmount() { /* override */ }
  onResize() { /* override */ }

  async unmount() {
    await this.onUnmount();
    this.notebook?.unmount();
    this.hud?.unmount();
    this.container.innerHTML = '';
  }

  el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    });
    children.forEach(c => {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }
}
