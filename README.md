# 📚 Guía Órdenes de Compra React + Node.js

Este README es una guía rápida que resume la **estructura de carpetas** a utilizar para el backend y el frontend. 
Trabajando en creacion de APIS cada uno. **Actualizado el 22/08/2025**

---

## 🗂️ Estructura general del repositorio

```
ordenes/
├─ backend/                  # API REST (Node.js + Express)
│  ├─ controllers/          # Lógica de control: recibe requests y llama a services
│  ├─ routes/               # Definición de endpoints y middlewares por módulo
│  ├─ service/              # Reglas de negocio / orquestación (antes de ir a la BD)
│  ├─ utils/                # Utilidades compartidas (helpers, validadores, logger, etc.)
│  └─ .gitkeep              # Mantiene la carpeta en Git cuando está vacía
│
├─ frontend/                 # Aplicación React (UI)
│  ├─ public/               # index.html + assets públicos
│  ├─ src/                  # Código fuente (componentes, vistas, estilos, etc.)
│  ├─ .gitignore            # Ignora node_modules, build, etc.
│  ├─ package.json          # Dependencias y scripts del frontend
│  └─ package-lock.json     # Lockfile de dependencias
│
└─ README.md                 # Este archivo
```

---

## 💻 Frontend (React)

### 📁 Estructura de carpetas (frontend)
```
frontend/
 ├── public/                  # Archivos estáticos públicos
 │   ├── index.html           # Plantilla base (punto de montaje de React)
 │   ├── favicon.ico          # Ícono del sitio
 │   └── manifest.json        # Configuración PWA
 │
 ├── src/                     # Código fuente de la app
 │   ├── components/          # Componentes reutilizables (inputs, tablas, etc.)
 │   ├── layout/              # Layouts y vistas principales
 │   ├── App.js               # Componente raíz
 │   ├── index.js             # Entrada: renderiza <App/> en public/index.html
 │   ├── index.css            # Estilos globales
 │   ├── reportWebVitals.js   # Métricas de rendimiento (opcional)
 │   └── setupTests.js        # Configuración de pruebas
 │
 ├── .gitignore               # Ignora /node_modules, /build, logs, .env*
 ├── package.json             # Dependencias y scripts del frontend
 └── package-lock.json        # Versiones exactas instaladas
```

### ▶️ Cómo levantar el frontend
```bash
cd frontend
npm install
npm start
# build de producción
npm run build
```

---

## 🔧 Backend (Node.js + Express)

> Nota: la estructura base mostrada proviene de la organización actual de carpetas.

### 📁 Estructura de carpetas (backend)
```
backend/
 ├── controllers/           # Controladores por dominio (ordenes, usuarios, etc.)
 ├── routes/                # Rutas por módulo (mapea endpoints -> controller)
 ├── service/               # Capa de negocio (validaciones, reglas, flujos)
 ├── utils/                 # Utilidades: helpers, errores, logger, etc.
 └── .gitkeep               # Mantiene la carpeta cuando no hay archivos
```

### ▶️ Cómo levantar el backend
```bash
cd backend
npm install
npm run dev   # o: npm start
```
---
