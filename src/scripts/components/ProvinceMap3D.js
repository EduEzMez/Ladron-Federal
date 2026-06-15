// =============================================================================
// MAPA 3D DE ARGENTINA — Three.js
// Visualiza las 24 provincias como nodos seleccionables sobre una vista
// estilizada del país. Incluye hover, tooltips, cámara suave, zoom, rotación
// y vuelo animado entre provincias usando GSAP.
//
// Nota de diseño: usamos un fondo cartoon low-poly con marcadores 3D por
// provincia (no polígonos GeoJSON) para mantener el bundle ligero y el
// rendimiento estable en mobile.
// =============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { PROVINCES } from '../data/provinces.js';

// Conversión lat/lng a coordenadas planas del juego.
// Argentina se proyecta sobre un plano X-Z; norte es -Z.
const PROJECTION = {
  centerLat: -38,
  centerLng: -64,
  scaleX: 14,
  scaleZ: 12,
};

function projectLatLng(lat, lng) {
  const x = (lng - PROJECTION.centerLng) * PROJECTION.scaleX;
  const z = -(lat - PROJECTION.centerLat) * PROJECTION.scaleZ;
  return { x, z };
}

const REGION_COLORS = {
  'Noroeste Argentino': 0xE63946,
  'Noreste Argentino':  0x06D6A0,
  'Cuyo':               0xFFD60A,
  'Centro':             0xF98948,
  'Pampeana':           0x118AB2,
  'Patagonia':          0x7B61FF,
};

export class ProvinceMap3D {
  constructor(canvas, { onSelect, highlightedProvinces = [], visitedProvinces = [], currentProvinceId = null } = {}) {
    this.canvas = canvas;
    this.onSelect = onSelect;
    this.highlighted = new Set(highlightedProvinces);
    this.visited = new Set(visitedProvinces);
    this.currentId = currentProvinceId;

    this._init();
    this._build();
    this._bindInput();
    this._animate();
  }

  _init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeaf6ff);

    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 60, 80);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Luces
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(20, 60, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    this.scene.add(sun);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-10, -10); // fuera de pantalla por defecto
    this.hovered = null;
  }

  _build() {
    // Base: silueta estilizada del país
    const baseGeo = new THREE.PlaneGeometry(120, 140, 8, 12);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xc9e8a3,
      roughness: 0.95,
      metalness: 0,
    });
    this.base = new THREE.Mesh(baseGeo, baseMat);
    this.base.rotation.x = -Math.PI / 2;
    this.base.position.y = -0.5;
    this.base.receiveShadow = true;
    this.scene.add(this.base);

    // Mar circundante
    const oceanGeo = new THREE.PlaneGeometry(300, 300);
    const oceanMat = new THREE.MeshStandardMaterial({ color: 0x8ecae6, roughness: 1 });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -1;
    ocean.receiveShadow = true;
    this.scene.add(ocean);

    // Cordillera estilizada al oeste
    this._addMountains();

    // Marcadores de provincia
    this.provinceMarkers = new Map();
    this.markerMeshes = [];

    PROVINCES.forEach(prov => {
      const { x, z } = projectLatLng(prov.lat, prov.lng);
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Pin: cilindro + esfera
      const colorHex = REGION_COLORS[prov.region] ?? 0xff9f43;
      const isVisited = this.visited.has(prov.id);
      const isCurrent = this.currentId === prov.id;
      const isHighlighted = this.highlighted.has(prov.id);

      const pinGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 8);
      const pinMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: isCurrent ? 0xffd60a : 0x000000,
        emissiveIntensity: isCurrent ? 0.6 : 0,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.y = 0.75;
      pin.castShadow = true;
      group.add(pin);

      const headGeo = new THREE.SphereGeometry(0.7, 16, 12);
      const headMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: isHighlighted ? 0xffd60a : 0x000000,
        emissiveIntensity: isHighlighted ? 0.4 : 0,
        roughness: 0.4,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.8;
      head.castShadow = true;
      group.add(head);

      // Disco indicando visitada
      if (isVisited) {
        const ringGeo = new THREE.TorusGeometry(1.2, 0.12, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x06d6a0 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.1;
        group.add(ring);
      }

      group.userData.province = prov;
      group.userData.head = head;
      group.userData.pin = pin;
      group.userData.baseHeadColor = colorHex;
      this.scene.add(group);
      this.provinceMarkers.set(prov.id, group);
      this.markerMeshes.push(head); // raycast target
      head.userData.parent = group;
    });
  }

  _addMountains() {
    // Cordillera estilizada: serie de conos al oeste
    const mountainColors = [0xa3a3a3, 0xbcbcbc, 0x8c8c8c];
    for (let i = 0; i < 14; i++) {
      const geo = new THREE.ConeGeometry(2 + Math.random() * 1.5, 4 + Math.random() * 3, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: mountainColors[i % mountainColors.length],
        flatShading: true,
      });
      const cone = new THREE.Mesh(geo, mat);
      cone.position.set(-50 + Math.random() * 6, 1.5, -55 + i * 8);
      cone.castShadow = true;
      this.scene.add(cone);
    }
  }

  _bindInput() {
    const onPointer = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      this.mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;
    };
    const onClick = () => {
      if (this.hovered) {
        const prov = this.hovered.userData.parent.userData.province;
        this.onSelect?.(prov);
      }
    };

    this.canvas.addEventListener('mousemove', onPointer);
    this.canvas.addEventListener('touchstart', onPointer, { passive: true });
    this.canvas.addEventListener('click', onClick);

    // Rotación arrastrada
    this._dragging = false;
    let lastX = 0, lastY = 0;
    this.cameraAngle = 0;
    this.cameraPitch = 1.0; // radianes desde el plano
    this.cameraDistance = 100;

    const startDrag = (e) => {
      this._dragging = true;
      lastX = e.touches ? e.touches[0].clientX : e.clientX;
      lastY = e.touches ? e.touches[0].clientY : e.clientY;
    };
    const moveDrag = (e) => {
      if (!this._dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      this.cameraAngle += (x - lastX) * 0.005;
      this.cameraPitch = Math.max(0.3, Math.min(1.4, this.cameraPitch + (y - lastY) * 0.003));
      lastX = x; lastY = y;
      this._updateCamera();
    };
    const endDrag = () => { this._dragging = false; };

    this.canvas.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);
    this.canvas.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', moveDrag, { passive: true });
    window.addEventListener('touchend', endDrag);

    // Zoom rueda
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(40, Math.min(180, this.cameraDistance + e.deltaY * 0.05));
      this._updateCamera();
    }, { passive: false });

    this._updateCamera();
  }

  _updateCamera() {
    const r = this.cameraDistance;
    this.camera.position.x = Math.sin(this.cameraAngle) * r * Math.cos(this.cameraPitch);
    this.camera.position.z = Math.cos(this.cameraAngle) * r * Math.cos(this.cameraPitch);
    this.camera.position.y = Math.sin(this.cameraPitch) * r;
    this.camera.lookAt(0, 0, 0);
  }

  _animate = () => {
    this._rafId = requestAnimationFrame(this._animate);

    // Raycast hover
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.markerMeshes);
    const newHover = hits[0]?.object ?? null;

    if (newHover !== this.hovered) {
      // Restaurar anterior
      if (this.hovered) {
        gsap.to(this.hovered.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
        this._hideTooltip();
      }
      this.hovered = newHover;
      if (newHover) {
        gsap.to(newHover.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.2 });
        this._showTooltip(newHover.userData.parent.userData.province);
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'grab';
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  _showTooltip(prov) {
    let tip = document.getElementById('province-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'province-tooltip';
      tip.className = 'province-tooltip';
      document.body.appendChild(tip);
    }
    tip.innerHTML = `<strong>${prov.name}</strong><br><span>${prov.capital} · ${prov.region}</span>`;
    tip.style.display = 'block';
    const rect = this.canvas.getBoundingClientRect();
    const x = ((this.mouse.x + 1) / 2) * rect.width + rect.left;
    const y = ((1 - this.mouse.y) / 2) * rect.height + rect.top;
    tip.style.left = `${x + 14}px`;
    tip.style.top = `${y + 14}px`;
  }

  _hideTooltip() {
    const tip = document.getElementById('province-tooltip');
    if (tip) tip.style.display = 'none';
  }

  flyTo(provinceId) {
    const marker = this.provinceMarkers.get(provinceId);
    if (!marker) return Promise.resolve();
    return new Promise(resolve => {
      const target = { x: marker.position.x, z: marker.position.z };
      // Mover cámara cerca del marker temporalmente
      gsap.to(this.camera.position, {
        x: target.x,
        y: 25,
        z: target.z + 25,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => this.camera.lookAt(target.x, 0, target.z),
        onComplete: () => {
          // Volver a vista general
          gsap.to(this.camera.position, {
            x: 0, y: 60, z: 80,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => this.camera.lookAt(0, 0, 0),
            onComplete: resolve,
          });
        },
      });
    });
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  destroy() {
    cancelAnimationFrame(this._rafId);
    this._hideTooltip();
    this.renderer.dispose();
    this.scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(m => m.dispose());
      }
    });
  }
}
