# Palabras Vivas 2.0

> Aplicación educativa gamificada para el aprendizaje de lectoescritura en niños de 4 a 6 años. Herramienta interactiva para profesores y padres que enseña vocabulario, sílabas y sonidos a través de imágenes, audio y juegos.

**[Ver en vivo →](https://davidcastanom.github.io/palabras-vivas-2.0/)**

---

## Lo que hace única a esta app

### Diseño pensado para niños
- **Dark mode por defecto** con contraste optimizado para ojos jóvenes
- **Tipografía Fredoka One** — redondeada, amigable, fácil de leer
- **Colores por categoría** — cada mundo tiene su paleta visual (Animales azul, Comida naranja, Casa verde)
- **Botones grandes** (mínimo 44px touch target) — accesible en tablets y móviles

### 7 juegos educativos progresivos
| Juego | Tipo | Habilidad | Dificultad |
|-------|------|-----------|------------|
| Aprender | Flashcard con audio | Memoria visual + auditiva | ★☆☆ |
| Encuentra la Palabra | Selección de imagen | Vocabulario + asociación | ★☆☆ |
| Escucha y Elige | Audio → imagen | Comprensión auditiva | ★☆☆ |
| Memoria | Pares imagen-palabra | Memoria de trabajo | ★★☆ |
| Ordena las Sílabas | Arrastrar sílabas | Conciencia fonológica | ★★☆ |
| Letras y Sílabas | Construir palabras | Segmentación silábica | ★☆☆ |
| Sopa de Letras | Búsqueda en cuadrícula | Reconocimiento visual | ★★★ |

### Sistema de audio completo
- **138 archivos MP3** — audio nativo de alta calidad por cada palabra y sílaba
- **Text-to-Speech (TTS)** — respaldo automático cuando el audio no está disponible
- **Secuencias de audio** — reproduce palabra completa → sílabas individuales
- **Sound effects** — feedback auditivo inmediato (correcto/incorrecto)

### Gamificación inteligente
- **Sistema de estrellas** — 1, 2 o 3 estrellas por precisión (50%/70%/90%)
- **Streak bonus** — puntos extra por rachas de respuestas correctas
- **Nivel de progresión** — Principiante → Aprendiz → Explorador → Maestro
- **Mejor puntuación guardada** — por juego y categoría, visible en la intro
- **Confetti animado** — celebración visual al completar un juego

### Router hash-based
- Navegación limpia: `#/game/animals/memory`
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
│   │   ├── app.js          # Orquestador principal
│   │   ├── router.js       # Hash-based router
│   │   └── store.js        # State management pub/sub
│   ├── components/
│   │   ├── core/           # Button, Card, Modal, Toast
│   │   └── layout/         # Header, Screen
│   ├── screens/
│   │   ├── Home/           # Selección de categorías
│   │   ├── GameMenu/       # Selección de juegos
│   │   ├── GameIntro/      # Intro antes de jugar
│   │   └── GamePlay/       # Pantalla de juego
│   ├── games/
│   │   ├── base/           # BaseGame (scoring, timer, state)
│   │   ├── complete-word/  # Encuentra la Palabra
│   │   ├── memory/         # Memoria
│   │   ├── syllables/      # Letras y Sílabas
│   │   ├── sort-letters/   # Ordena las Sílabas
│   │   └── word-search/    # Sopa de Letras
│   ├── data/
│   │   ├── words.js        # 62 palabras + metadata
│   │   └── games.js        # Metadata de juegos
│   ├── services/
│   │   └── AudioService.js # MP3 + TTS + sound effects
│   ├── styles/
│   │   ├── base/           # Variables, reset, typography, animations
│   │   └── responsive/     # Breakpoints
│   └── types/              # TypeScript .d.ts definitions
├── tests/                  # Vitest unit tests
├── public/
│   ├── audio/              # 138 archivos MP3
│   └── logo.png
├── vitest.config.js
├── tsconfig.json
└── vite.config.js
```

### Stack tecnológico
| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Bundler | **Vite 5.4** | HMR instantáneo, builds rápidos con esbuild |
| Testing | **Vitest 2.0** | Compatible con Vite, API similar a Jest |
| Linting | **ESLint 9** | Reglas modernas, flat config |
| Formateo | **Prettier 3** | Consistencia de código automática |
| Tipos | **TypeScript (solo .d.ts)** | IDE support sin migrar el codebase |
| Deployment | **GitHub Pages** | Hosting gratuito, CDN global |
| CI/CD | **GitHub Actions** | Quality checks → Build → Deploy automático |

### Design System
- **120+ tokens CSS** — colores, espaciado, tipografía, sombras, z-index
- **Dark/Light mode** — toggle con persistencia en localStorage
- **BEM naming** — consistencia en todos los componentes
- **Utility classes** — helpers para margin, padding, flex, text, rounded
- **Responsive** — mobile-first con breakpoints en 640px y 1024px

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
| `npx vitest run` | Ejecutar tests |
| `npx vitest --ui` | Interfaz visual de tests |
| `npm run typecheck` | Verificar tipos TypeScript |

---

## Datos

### 62 palabras en 5 categorías

| Categoría | Palabras | Color |
|-----------|----------|-------|
| Animales | gato, perro, pez, pájaro, vaca, rana, león, oso | `#0066FF` |
| Comida | manzana, pan, leche, agua, arroz, huevo, queso, galleta | `#FF6B35` |
| Casa | casa, mesa, silla, puerta, ventana, cama, lámpara, espejo | `#00D4AA` |
| Colores | rojo, azul, verde, amarillo, morado, naranja, rosa, negro | `#FFD93D` |
| Familia | mamá, papá, hermano, abuelo, bebé, primo, tío, prima | `#FF6B9D` |

Cada palabra incluye:
- Imagen Cloudinary de alta calidad
- Nombre en español
- Separación silábica (ej: `ga-to`)
- Audio MP3 nativo

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

---

## Roadmap

### Completado
- [x] 5 categorías con 62 palabras
- [x] 7 juegos educativos
- [x] Audio nativo + TTS
- [x] Dark/Light mode
- [x] Responsive mobile-first
- [x] Hash router con guards
- [x] State management pub/sub
- [x] 33 unit tests
- [x] TypeScript type definitions
- [x] CI/CD con quality checks
- [x] Nivel de progresión (Principiante → Maestro)
- [x] Mejor puntuación por juego/categoría
- [x] Botón de reinicio en juegos
- [x] Confirmación de salida con progreso activo

### Próximamente
- [ ] Modo offline con Service Worker
- [ ] PWA completa (installable)
- [ ] Analytics de progreso del estudiante
- [ ] Modo profesor (crear categorías personalizadas)
- [ ] Más palabras y categorías
- [ ] Juegos multijugador en red local

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
