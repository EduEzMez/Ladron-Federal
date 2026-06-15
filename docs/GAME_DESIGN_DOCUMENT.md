# Game Design Document — Tras las Huellas del Ladrón Federal

> Documento de diseño v1.0 · pensado como referencia de producción AAA.

---

## 1. Visión

**Tras las Huellas del Ladrón Federal** es un juego educativo argentino para niños y niñas de 10 a 12 años, inspirado en la mecánica clásica de *Carmen Sandiego* (1985, Brøderbund) pero reinterpretado completamente con identidad local: geografía argentina, patrimonio cultural argentino y estética cartoon low-poly contemporánea.

La premisa narrativa: una organización ficticia llamada **"Los Saqueadores del Patrimonio"** roba elementos representativos de las provincias —tango, mate, chamamé, Vendimia, Glaciar Perito Moreno— y el jugador, agente de la **Agencia Federal de Protección Cultural**, debe seguir el rastro del ladrón a través de las 24 provincias, identificarlo, emitir una orden de captura y atraparlo antes de que se cumplan 7 días.

### Pilares de diseño

1. **Educativo, no didáctico**. Aprender no como obligación sino como herramienta para ganar.
2. **Pensamiento deductivo activo**. Las pistas nunca son explícitas: requieren inferencia.
3. **Cero violencia, cero estereotipos**. Los criminales son "saqueadores culturales", no armados.
4. **Identidad argentina genuina**. Cada provincia tiene sus rasgos verídicos.
5. **Accesibilidad de fábrica**. Mobile-first, navegación por teclado, alto contraste, reduce-motion.

---

## 2. Audiencia

- **Edad**: 10 a 12 años.
- **Contexto de uso**: escolar y recreativo (escuelas primarias, hogar).
- **Plataformas**: web (mobile, tablet, notebook, desktop). PWA opcional en fase posterior.
- **Tiempo de sesión esperado**: 15 a 30 minutos por caso.

### Justificación psicopedagógica

Según el modelo piagetiano, los 10–12 años marcan la entrada al estadio de **operaciones formales**: aparecen el pensamiento hipotético-deductivo, la planificación a varios pasos y la metacognición. El juego está específicamente diseñado para ejercitar estas competencias:

- **Memoria de trabajo**: retener pistas y combinarlas.
- **Atención sostenida**: leer testimonios sin perder el hilo.
- **Función ejecutiva**: priorizar acciones bajo presión temporal.
- **Tolerancia a la frustración**: las pistas falsas se reencuadran como "oportunidad de revisión", no castigo.
- **Lectura inferencial**: extraer información implícita.

---

## 3. Mecánicas

### 3.1 Ciclo principal

```
Robo inicial → Investigación → Recolectar pistas → Viajar → Identificar →
Orden de captura → Arresto → Victoria / Derrota
```

### 3.2 Economía de tiempo

El jugador dispone de **7 días = 168 horas**. Cada acción consume horas:

| Acción              | Costo  |
| ------------------- | ------ |
| Hablar con testigo  | 2h     |
| Investigar archivo  | 3h     |
| Emitir orden        | 1h     |
| Viaje corto (misma región) | 6h |
| Viaje largo (otra región) | 12h |

Si el tiempo llega a cero → **derrota por escape del ladrón**.

### 3.3 Sistema de pistas

Las pistas tienen dos categorías:

1. **Geográficas**: indican el próximo destino sin nombrarlo.
   - Ej: *"Compró una guía sobre glaciares"* (Santa Cruz).
   - Ej: *"Quería visitar la provincia más famosa por su vino"* (Mendoza).

2. **De identidad**: revelan un atributo del sospechoso.
   - Ej: *"Era pelirrojo"* → atributo `hair = pelirrojo`.
   - Ej: *"Trabajaba de chef"* → atributo `profession = chef`.

Las pistas se acumulan en el **cuaderno del detective** (componente Notebook). Los atributos confirmados se aplican como filtro al roster de sospechosos.

### 3.4 Sistema de sospechosos

- Roster de **120 sospechosos** generados procedimentalmente con seed determinista.
- Cada sospechoso tiene 8 atributos: `name`, `alias`, `hair`, `profession`, `hobby`, `food`, `place`, `color` (+ `accessory`).
- El **CaseGenerator** asigna uno como el verdadero criminal del caso.
- Cada testigo apunta a un atributo distinto del verdadero criminal.
- Con 3+ atributos confirmados, el roster suele reducirse a 1 sospechoso identificable.

### 3.5 Orden de captura

- El jugador elige un sospechoso de la lista filtrada.
- Si coincide con el verdadero ladrón → la orden es correcta. Falta atraparlo en su destino final.
- Si no coincide → toast de advertencia, pero no game over. El jugador puede emitir una nueva orden (manda señal pedagógica: revisá tus pistas).

### 3.6 Captura

- Requiere estar en la provincia final del recorrido **+** orden de captura emitida correctamente.
- Cinemática de captura → VictoryScene.

### 3.7 Pistas falsas

Si el jugador elige una provincia incorrecta para viajar:
- Pierde **6 horas** (viaje en vano).
- Toast: "Pista falsa, perdiste 6h. Volvé a revisar".
- Vuelve a la oficina, no a la provincia incorrecta.

Esto enseña a **verificar antes de actuar**.

---

## 4. Contenido

### 4.1 Provincias

Las 24 jurisdicciones argentinas (23 provincias + CABA) con datos verídicos:

- Capital, región (NOA, NEA, Cuyo, Pampeana, Patagonia, CABA), latitud, longitud.
- Clima y terreno predominantes.
- 3–5 elementos culturales típicos.
- 2–4 comidas, músicas, sitios geográficos.

### 4.2 Objetos culturales (≈45)

Distribuidos por categoría: música, danza, gastronomía, festividad, geografía natural, fauna, indumentaria, ritual.

Cada objeto tiene:
- `name`, `description`, `province` (id), `category`, `difficulty` (1–3).

### 4.3 Sospechosos (120 procedimentales)

Generados al inicio de la sesión con seed `'huellas-2025'`. Determinista: las mismas semillas producen el mismo roster.

### 4.4 Casos (≥100)

`generateCaseDossier(100)` produce 100 casos únicos. Cada caso es regenerable a partir de su seed (almacenado en localStorage).

### 4.5 Pistas

Plantillas:
- `GEOGRAPHIC_CLUE_TEMPLATES` (~15 plantillas que reciben la provincia destino).
- `IDENTITY_CLUE_TEMPLATES` (~12 plantillas que reciben el sospechoso).

Cada testigo combina una plantilla geográfica + una de identidad, con `intro` y `outro` para dar verosimilitud.

---

## 5. Escenas

| ID             | Propósito                             | Música       |
| -------------- | ------------------------------------- | ------------ |
| title          | Pantalla inicial, menú                | menu         |
| intro          | Briefing del caso                     | investigate  |
| office         | Hub central de acciones               | investigate  |
| archive        | Sala de expedientes                   | investigate  |
| map            | Mapa 3D Argentina, elegir destino     | investigate  |
| travel         | Tránsito animado                      | travel       |
| interrogation  | Entrevista con testigos               | investigate  |
| capture        | Cinemática de captura                 | investigate  |
| victory        | Resumen del caso ganado               | victory      |
| defeat         | Mensaje motivacional + reveal         | defeat       |
| credits        | Equipo y agradecimientos              | menu         |

---

## 6. Loop de progresión

```
Nueva partida
   ↓
Intro (briefing)
   ↓
Office ←─────────────────────┐
   │                          │
   ├→ Interrogation → vuelve ─┤
   ├→ Archive → vuelve ────────┤
   ├→ Map → Travel → Office ──┘ (correcta) o
   │                            Office (pista falsa, -6h)
   ├→ Warrant (modal en office)
   └→ Capture → Victory / Office (si falla)
                       ↓
                  Time = 0 → Defeat
```

---

## 7. Sistema de logros

| ID                       | Disparador                                |
| ------------------------ | ----------------------------------------- |
| `first_case`             | Resolver el primer caso                   |
| `detective_novato`       | Resolver 3 casos                          |
| `detective_experto`      | Resolver 10 casos                         |
| `maestro_geografia`      | Visitar las 24 provincias acumuladas      |
| `protector_cultural`     | Visitar las 6 regiones culturales         |
| `sin_pestañear`          | Ganar en menos de 3 días                  |
| `sin_pistas_falsas`      | Ganar con 1 sola orden de captura emitida |

---

## 8. Accesibilidad

- **Teclado**: tab/enter/esc navegan toda la UI.
- **Outline visible** en focus (3px sólido amarillo).
- **Alto contraste**: `[data-contrast="high"]` invierte la paleta.
- **Texto escalable**: `--font-scale` configurable y respeta el zoom del navegador.
- **Reduce motion**: respeta `prefers-reduced-motion`.
- **Tamaño táctil**: 44–48px mínimo.
- **Lectura semántica**: roles ARIA, `<main>`, `<header>`, `<nav>`.

---

## 9. Persistencia

`SaveSystem` en `localStorage` con namespace `tras-las-huellas:*:v1`:

- `save`: caso activo (seed, tiempo, pistas, provincia, orden).
- `stats`: casos jugados/ganados/perdidos, provincias visitadas.
- `achievements`: ids desbloqueados.
- `settings`: alto contraste, escala de fuente.

Auto-guardado en eventos clave (después de entrevistar, viajar, emitir orden) y en `beforeunload`.

---

## 10. Audio

Generación procedural con **Web Audio API** (cero archivos externos → cero copyright):

- **Tracks musicales**: menu, investigate, travel, victory, defeat. Patrones rítmicos sintetizados.
- **SFX**: click, confirm, error, document, discover, airplane, capture.

---

## 11. Arte

Estilo cartoon low-poly 3D:
- Paleta: rojo `#E63946`, amarillo `#FFD60A`, azul `#118AB2`, verde `#06D6A0`, blanco.
- Tipografía: **Bebas Neue** (títulos) + **Nunito** (cuerpo).
- Provincias representadas como pines 3D estilizados (cilindro + esfera) en mapa Three.js.
- Personajes: emojis estilizados con avatares color (provisional; reemplazables por modelos GLB en fase 2).

---

## 12. Producción y expansión

Ver `EXPANSION_PLAN.md` para roadmap a 4 fases.
