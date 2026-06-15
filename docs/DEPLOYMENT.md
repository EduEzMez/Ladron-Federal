# Deployment — Tras las Huellas del Ladrón Federal

## 1. Requisitos

- **Node.js** ≥ 18 (recomendado 20 LTS).
- **npm** ≥ 9 (incluido con Node 18+).
- Navegador moderno con soporte ES2022 + WebGL2.

---

## 2. Instalación local

```bash
# 1. Descomprimir el proyecto y entrar en la carpeta
cd tras-las-huellas

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Se abre automáticamente en `http://localhost:5173/`. Hot Module Replacement activo: cualquier cambio en `src/` recarga instantáneamente.

---

## 3. Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con:
- `index.html` minificado.
- `assets/*.js` con hashes para cache busting.
- `assets/*.css` minificados.
- Sourcemaps `.js.map` para debugging.

### Previsualizar el build local

```bash
npm run preview
```

Sirve `dist/` en `http://localhost:4173/` simulando producción.

---

## 4. Deployment

El juego es **100% estático** (sin backend), por lo que se puede alojar en cualquier servicio de archivos estáticos.

### 4.1 Vercel (recomendado, gratis)

```bash
# Una sola vez
npm install -g vercel
vercel login

# Deploy
vercel --prod
```

Configuración detectada automáticamente: framework `Vite`, output `dist`.

### 4.2 Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --build --prod
```

O usar la interfaz web arrastrando la carpeta `dist/`.

### 4.3 GitHub Pages

1. En `vite.config.js`, asegurate de que `base: './'`.
2. Build: `npm run build`.
3. Pushear `dist/` a la rama `gh-pages`:

```bash
npx gh-pages -d dist
```

Activar Pages en Settings → Pages → Source: branch `gh-pages`.

### 4.4 Servidor propio (nginx)

```nginx
server {
  listen 80;
  server_name juego.escuela.edu.ar;
  root /var/www/tras-las-huellas/dist;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache de assets con hash
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Compresión
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1000;

  # Seguridad
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

---

## 5. Variables de entorno

El juego no requiere variables de entorno. Toda la lógica corre en el cliente.

Si en el futuro se incorporan analytics o backend opcional:

```bash
# .env.local
VITE_ANALYTICS_KEY=xxxx
```

Acceso en código: `import.meta.env.VITE_ANALYTICS_KEY`.

---

## 6. Content Security Policy recomendada

En el HTML o como header del servidor:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
  font-src https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self';
  base-uri 'self';
  form-action 'none';
  frame-ancestors 'none';
```

---

## 7. Compatibilidad de navegadores

| Navegador        | Versión mínima |
| ---------------- | -------------- |
| Chrome / Edge    | 100+           |
| Firefox          | 100+           |
| Safari (macOS)   | 15.4+          |
| Safari (iOS)     | 15.4+          |
| Samsung Internet | 19+            |

Características críticas:
- ES2022 (top-level await, classes con campos privados).
- WebGL2 para Three.js.
- localStorage.
- Web Audio API.
- CSS Container Queries (opcional, fallback con media queries).

---

## 8. Lectura rápida (cheatsheet)

```bash
npm install            # instalar
npm run dev            # desarrollo (5173)
npm run build          # build producción
npm run preview        # ver build local (4173)
vercel --prod          # deploy a Vercel
```

---

## 9. Troubleshooting

**El mapa 3D no aparece**: probablemente WebGL deshabilitado. Chrome: `chrome://gpu`. Verificar que "Hardware-accelerated WebGL" esté activo.

**No se guarda el progreso**: localStorage bloqueado por el navegador en modo incógnito. Avisar al jugador.

**Audio no suena**: políticas de autoplay del navegador requieren interacción del usuario antes de iniciar audio. Por eso `audio.init()` se llama después del primer click.

**Performance lenta en móvil viejo**: bajar `pixelRatio` en `ProvinceMap3D.js` constructor de `WebGLRenderer({ antialias: false })`.
