# 🕵️ Tras las Huellas del Ladrón Federal

> Juego educativo argentino de detectives, geografía y patrimonio cultural, para niños y niñas de **10 a 12 años**. Inspirado en *Carmen Sandiego*, hecho 100% Vanilla JS + Three.js + GSAP.

---

## ¿De qué se trata?

Una organización ficticia, **"Los Saqueadores del Patrimonio"**, roba elementos culturales argentinos (tango, mate, Vendimia, Glaciar Perito Moreno…) y los esconden recorriendo el país. El jugador es un detective de la **Agencia Federal de Protección Cultural** y debe:

1. **Recolectar pistas** entrevistando a testigos (cada conversación gasta 2 horas).
2. **Cruzar pistas** en el archivo para reducir la lista de sospechosos.
3. **Viajar por las 24 provincias** siguiendo el rastro del ladrón.
4. **Emitir una orden de captura** cuando tenga suficientes atributos verificados.
5. **Atraparlo en su destino final**, antes de que se cumplan **7 días**.

---

## ✨ Características

- 🗺️ **Mapa 3D interactivo** de Argentina (Three.js).
- 🎲 **Generación procedural**: 100+ casos únicos, 120 sospechosos.
- 🧠 **Pistas inferenciales**: ninguna pista nombra la respuesta. El jugador deduce.
- 🇦🇷 **Datos verídicos** de las 24 jurisdicciones: capital, clima, terreno, comidas, música, sitios.
- 🎵 **Audio procedural** con Web Audio API (cero archivos, cero copyright).
- 🏆 **7 logros** desbloqueables.
- ♿ **Accesibilidad**: teclado, alto contraste, reduce-motion, mobile-first, tamaños táctiles 44px+.
- 💾 **Persistencia automática** en `localStorage`.
- 📄 **Manual PDF descargable** generado client-side.
- 🌐 **100% offline después de la primera carga** (PWA-ready).

---

## 🚀 Empezar

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`.

Build de producción:

```bash
npm run build
npm run preview
```

Ver `docs/DEPLOYMENT.md` para deploy a Vercel, Netlify, GitHub Pages o nginx propio.

---

## 📚 Documentación

| Documento | Contenido |
| --- | --- |
| `docs/GAME_DESIGN_DOCUMENT.md` | Diseño completo: mecánicas, audiencia, justificación psicopedagógica. |
| `docs/TECHNICAL_ARCHITECTURE.md` | Arquitectura: capas, EventBus, sistemas, generadores, mapa 3D. |
| `docs/DEPLOYMENT.md` | Cómo desplegarlo en distintos servicios. |
| `docs/EXPANSION_PLAN.md` | Roadmap a 4 fases. |
| `docs/tutorial.pdf` | Manual del detective (también generable in-game). |

---

## 🧰 Stack

- **Lenguaje**: JavaScript ES2025 (Vanilla, sin frameworks).
- **3D**: Three.js 0.160
- **Animación**: GSAP 3.12
- **PDF**: jsPDF 2.5
- **Build**: Vite 5
- **Audio**: Web Audio API (nativo).

Sin React, sin Vue, sin Angular, sin backend, sin dependencias pesadas.

---

## 🗂️ Estructura

```
tras-las-huellas/
├── docs/              # GDD, arquitectura, deploy, expansión, tutorial PDF
├── public/            # favicon, estáticos
├── src/
│   ├── scripts/
│   │   ├── components/   # HUD, Notebook, Toast, Map3D, PDFGenerator
│   │   ├── core/         # EventBus, SceneManager, Game
│   │   ├── data/         # provinces, culturalItems, plantillas
│   │   ├── generators/   # CaseGenerator, SuspectGenerator
│   │   ├── scenes/       # 11 escenas
│   │   ├── systems/      # Time, Clue, Case, Save, Audio, Achievement
│   │   └── utils/        # random (PRNG seeded)
│   ├── styles/        # variables, main, components, responsive
│   └── main.js        # bootstrap
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎯 Diseño pedagógico (resumen)

Cada caso ejercita:

| Competencia              | Cómo |
| ------------------------ | ---- |
| Memoria de trabajo       | Retener pistas durante el caso. |
| Atención sostenida       | Leer testimonios sin perder hilo. |
| Función ejecutiva        | Priorizar acciones bajo presión temporal. |
| Lectura inferencial      | Extraer información implícita de cada pista. |
| Pensamiento crítico      | Verificar antes de viajar (6h de penalidad). |
| Resolución de problemas  | Múltiples variables: tiempo, recursos, espacio. |
| Geografía argentina      | Datos verídicos de las 24 jurisdicciones. |
| Patrimonio cultural      | ~45 elementos culturales documentados. |

---

## ⚖️ Licencia y créditos

- Código: MIT.
- Tipografías: Nunito y Bebas Neue (Google Fonts, SIL Open Font License).
- Three.js: MIT.
- GSAP: free for non-commercial. Para uso comercial revisar licencia.
- Datos geográficos y culturales: dominio público de uso educativo.

Equipo (roles): Lead Game Designer, Narrative Designer, Psicopedagogo, UX/UI, Frontend Architect, JS Sr Dev, Three.js Sr Dev, Art Director, Sound Designer, QA. Ver `CreditsScene` in-game.

---

## ❤️ Hecho en Argentina

Para que aprender geografía sea una aventura.
