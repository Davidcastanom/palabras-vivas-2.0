# Palabras Vivas 2.0

> Aplicación educativa gamificada para el aprendizaje de lectoescritura en niños de 4 a 6 años. Herramienta interactiva para profesores y padres que enseña vocabulario, sílabas y sonidos a través de imágenes, audio y juegos. **Funciona offline** — diseñada para aulas con internet inestable.

**[Ver en vivo →](https://davidcastanom.github.io/palabras-vivas-2.0/)**

---

## Lo que hace única a esta app

### Diseño pensado para niños
- **Dark mode por defecto** con contraste optimizado para ojos jóvenes
- **Tipografía Fredoka One** — redondeada, amigable, fácil de leer
- **Colores por categoría** — cada mundo tiene su paleta visual (Animales azul, Frutas naranja, Casa verde)
- **Botones grandes** (mínimo 44px touch target) — accesible en tablets y móviles
- **Menú hamburguesa responsive** — navegación completa por categorías + tema + inicio en móvil

### 8 modos de aprendizaje
| Modo | Tipo | Habilidad | Dificultad |
|------|------|-----------|------------|
| Aprender | Flashcard con audio + sílabas | Memoria visual + auditiva | ★☆☆ |
| Encuentra la Palabra | Selección de imagen | Vocabulario + asociación | ★☆☆ |
| Escucha y Elige | Audio → imagen | Comprensión auditiva | ★☆☆ |
| Memoria | Pares imagen-palabra | Memoria de trabajo | ★★☆ |
| Ordena las Sílabas | Arrastrar sílabas | Conciencia fonológica | ★★☆ |
| Letras y Sílabas | Construir palabras con sílabas | Segmentación silábica + sonidos | ★★☆ |
| Sopa de Letras | Búsqueda en cuadrícula | Reconocimiento visual | ★★★ |
| Escribir | Escritura letra por letra | Motricidad fina + deletreo | ★★☆ |

### Sistema de audio completo
- **138 archivos MP3** — audio nativo de alta calidad por cada palabra y sílaba
- **Text-to-Speech (TTS)** — respaldo automático cuando el audio no está disponible
- **Secuencias de audio** — reproduce palabra completa → sílabas individuales
- **Sound effects** — sonidos de éxito, error y celebración (Web Audio API) en todos los juegos

### Gamificación inteligente
- **Sistema de estrellas** — 1, 2 o 3 estrellas por precisión (50%/70%/90%)
- **Streak bonus** — puntos extra por rachas de respuestas correctas
- **Nivel de progresión** — Principiante → Aprendiz → Explorador → Maestro
- **Mejor puntuación guardada** — por juego y categoría, visible en la intro
- **Reiniciar estrellas** — toca las estrellas en el header para reiniciar el conteo
- **Pantalla de resultados** — al terminar cada juego: estadísticas, opción de reiniciar con palabras reordenadas o volver al menú
- **Confetti animado** — celebración visual al completar un juego

### Funciona offline (PWA)
- **Service Worker** — cachea todos los assets automáticamente
- **Instalable** — se puede instalar como app en tablets y móviles
- **Sin dependencia de internet** — una vez cargado, funciona 100% offline
- **Ideal para aulas** — internet inestable no es problema

### Router hash-based
- Navegación limpia: `#/game/animales/memory`
- Botón "atrás" con confirmación cuando hay progreso activo
- URLs compartibles — profesores pueden enviar enlaces directos a juegos

### State management centralizado
- Store pub/sub reactivos — la UI se actualiza automáticamente
- Persistencia en localStorage — progreso y tema se mantienen entre sesiones
- Middleware pipeline — extensible para analytics, logging, etc.

---

## Arquitectura técnica

```
palabras-vivas-2.0/
├── src/
│   ├── core/
│   │   ├── app.js              # Orquestador principal
│   │   ├── router.js           # Hash-based router
│   │   └── store.js            # State management pub/sub
│   ├── components/
│   │   ├── core/               # Button, Card, Modal, Toast
│   │   └── layout/             # Header (nav, theme, stars), Screen
│   ├── screens/
│   │   ├── Home/               # Categorías + escritura
│   │   ├── GameMenu/           # Selección de juegos
│   │   ├── GameIntro/          # Intro antes de jugar
│   │   ├── GamePlay/           # Pantalla de juego
│   │   │   └── renderers/      # Renderers por juego (8 archivos)
│   │   │       ├── learn.js
│   │   │       ├── completeWord.js
│   │   │       ├── association.js
│   │   │       ├── memory.js
│   │   │       ├── syllables.js
│   │   │       ├── sortLetters.js
│   │   │       └── wordSearch.js
│   │   └── WritePractice/      # Escritura letra por letra
│   ├── games/
│   │   ├── base/               # BaseGame (scoring, timer, state, shuffle)
│   │   ├── complete-word/      # Encuentra la Palabra
│   │   ├── memory/             # Memoria
│   │   ├── syllables/          # Letras y Sílabas
│   │   ├── sort-letters/       # Ordena las Letras
│   │   └── word-search/        # Sopa de Letras
│   ├── data/
│   │   ├── words.js            # 62 palabras + metadata (Cloudinary images)
│   │   └── games.js            # Metadata de juegos
│   ├── services/
│   │   └── AudioService.js     # MP3 + TTS + syllables + sound effects (Web Audio API)
│   ├── styles/
│   │   ├── base/               # Variables, reset, typography, animations
│   │   └── responsive/         # Breakpoints
│   └── types/                  # TypeScript .d.ts definitions
├── tests/                      # Vitest unit tests (61 tests)
│   ├── core/                   # Store + Router tests
│   ├── data/                   # Words + Games data tests
│   └── games/                  # Game logic tests
├── public/
│   ├── audio/                  # 138 archivos MP3
│   ├── sw.js                   # Service Worker
│   └── logo.png
├── vitest.config.js
├── tsconfig.json
└── vite.config.js
```

### Stack tecnológico
| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Bundler | **Vite 5.4** | HMR instantáneo, builds <1s con esbuild |
| Testing | **Vitest 2.0** | Compatible con Vite, API similar a Jest |
| Linting | **ESLint 9** | Reglas modernas, flat config |
| Formateo | **Prettier 3** | Consistencia de código automática |
| Tipos | **TypeScript (solo .d.ts)** | IDE support sin migrar el codebase |
| Offline | **Service Worker** | Cache-first para assets, network-first para HTML |
| Deployment | **GitHub Pages** | Hosting gratuito, CDN global |
| CI/CD | **GitHub Actions** | Lint + Tests → Build → Deploy automático |

### Design System
- **120+ tokens CSS** — colores, espaciado, tipografía, sombras, z-index
- **Dark/Light mode** — toggle con persistencia en localStorage (🌙/☀️)
- **BEM naming** — consistencia en todos los componentes
- **Button component** — variantes primary/secondary con tamaños sm/md/lg/xl, glow, full-width
- **Utility classes** — helpers para margin, padding, flex, text, rounded
- **Responsive** — mobile-first con breakpoints en 480px, 640px, 768px y 1024px

---

## Cómo ejecutar

### Requisitos previos
- Node.js 18+
- npm 9+

### Instalación
```bash
git clone https://github.com/Davidcastanom/palabras-vivas-2.0.git
cd palabras-vivas-2.0
npm install
```

### Desarrollo
```bash
npm run dev
# Abre http://localhost:3000
```

### Scripts disponibles
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Formatear código con Prettier |
| `npx vitest run` | Ejecutar tests (61 tests) |
| `npx vitest --ui` | Interfaz visual de tests |
| `npm run typecheck` | Verificar tipos TypeScript |

---

## Datos

### 62 palabras en 5 categorías

| Categoría | Palabras | Color |
|-----------|----------|-------|
| Animales | perro, gato, león, vaca, elefante, caballo, oso, pato, conejo, oveja, cerdo, gallina, tigre, mono, pez | `#0066FF` |
| Frutas | manzana, uvas, banana, naranja, fresa, sandía, piña, melón, pera, cereza, limón, kiwi | `#FF6B35` |
| Objetos | auto, pelota, libro, casa, mesa, silla, juguete, bicicleta, avión, barco, tren, globo | `#00D4AA` |
| Familia | mamá, papá, abuelo, abuela, hermano, hermana, bebé, tío, tía, primo, prima | `#FF6B9D` |
| Cuerpo | mano, pie, cabeza, ojo, nariz, boca, oreja, brazo, pierna, dedo, rodilla, hombro | `#FFD93D` |

Cada palabra incluye:
- Imagen Cloudinary de alta calidad
- Nombre en español
- Separación silábica (ej: `Pe-rro`)
- Audio MP3 nativo + audio de sílabas
- Sonido representativo (ej: ladrido, maullido)

---

## Cómo usar en el aula

### Para profesores
1. Abre la app en una tablet o computador
2. La primera vez, necesitas internet para cargar todos los assets
3. Después, la app funciona **sin internet** (Service Worker)
4. Los alumnos eligen un mundo → eligen un modo → aprenden y juegan
5. El progreso se guarda automáticamente en cada dispositivo

### Modos disponibles
- **Aprender** — Modo flashcard: imagen + palabra + sílabas con audio. Ideal para introducir vocabulario nuevo.
- **Escribir** — Escritura guiada letra por letra con pronunciación de sílabas. Ideal para practicar ortografía.
- **Juegos** — 6 juegos progresivos con sonidos de retroalimentación, imágenes y resultados detallados.

### Para configurar en múltiples aulas
1. Abre la app en cada dispositivo con internet (una sola vez)
2. El Service Worker cachea todo automáticamente
3. Después, cada tablet funciona de forma independiente
4. No hay servidor central — cada dispositivo guarda su propio progreso

### Tips
- **Modo landscape** funciona mejor en tablets
- **Audio** se reproduce automáticamente en el modo "Aprender"
- **Reiniciar** un juego: toca el icono de reinicio (↺) al lado del botón de pausa
- **Reiniciar estrellas**: toca el contador de estrellas en el header
- **Salir** del juego: toca la flecha ← o el botón de pausa — se confirma antes de salir
- **Cada vez que juegas** el orden de las palabras es diferente (variabilidad)

---

## Cómo contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz tus cambios
4. Ejecuta tests: `npx vitest run`
5. Ejecuta lint: `npm run lint`
6. Commit: `git commit -m "feat: descripción del cambio"`
7. Push: `git push origin feature/nueva-funcionalidad`
8. Abre un Pull Request

### Convenciones
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`)
- **CSS**: BEM naming, usar tokens del design system
- **JS**: ES6+ modules, classes para componentes, funciones puras para utilidades
- **Tests**: Vitest, cubrir lógica de negocio (juegos, scoring, router)
- **Renderers**: Un archivo por juego en `renderers/`, importar en GamePlay.js
- **Sonidos**: Usar `audioService` importado directamente en renderers

---

## Roadmap

### Completado
- [x] 5 categorías con 62 palabras
- [x] 8 modos de aprendizaje (7 juegos + escritura)
- [x] Audio nativo + TTS (138 MP3) + sound effects (Web Audio API)
- [x] Dark/Light mode
- [x] Responsive mobile-first
- [x] Hash router con guards
- [x] State management pub/sub
- [x] 61 unit tests
- [x] TypeScript type definitions
- [x] CI/CD con quality checks
- [x] Nivel de progresión (Principiante → Maestro)
- [x] Mejor puntuación por juego/categoría
- [x] Botón de reinicio en juegos
- [x] Confirmación de salida con progreso activo
- [x] Service Worker (offline mode)
- [x] PWA installable
- [x] Renderers extraídos por juego
- [x] Lazy loading de imágenes
- [x] Accessibility (aria-labels, keyboard nav)
- [x] Sound effects en todos los juegos (correcto/incorrecto/celebración)
- [x] Imágenes en juegos de sílabas y ordena letras
- [x] Botones de Limpiar/Verificar estilizados con iconos
- [x] Flujo de finalización corregido — todos los juegos muestran resultados
- [x] Reiniciar estrellas desde el header
- [x] Pantalla de resultados con estadísticas + reiniciar/volver
- [x] Variabilidad en cada reinicio (palabras reordenadas)
- [x] Plataforma de escritura (letra por letra con pronunciación)
- [x] Menú hamburguesa con navegación por categorías

### Próximamente
- [ ] Analytics de progreso del estudiante
- [ ] Modo profesor (crear categorías personalizadas)
- [ ] Más palabras y categorías
- [ ] Juegos multijugador en red local
- [ ] Export de progreso (CSV/PDF)

---

## Licencia

MIT © Flujo Base

---

## Reconocimientos

- Imágenes: Cloudinary CDN
- Iconos: Font Awesome 6.5.1
- Fuentes: Google Fonts (Fredoka One, Poppins, Space Grotesk)
- Confetti: canvas-confetti
- Testing: Vitest
