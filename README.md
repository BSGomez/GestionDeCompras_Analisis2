# 📂 Guía del Proyecto - Frontend Órdenes de Compra

Este documento explica la **estructura de carpetas y archivos principales** del frontend de la aplicación **Órdenes de Compra**.  
Su objetivo es servir como referencia rápida para los desarrolladores que colaboren en este proyecto.

---

## 📁 Estructura de carpetas

```
frontend/
 ├── public/              # Archivos estáticos públicos
 │   ├── index.html       # Página base del proyecto (punto de entrada)
 │   ├── favicon.ico      # Ícono del sitio
 │   └── manifest.json    # Configuración de la aplicación web
 │
 ├── src/                 # Código fuente de la aplicación React
 │   ├── components/      # Componentes reutilizables (botones, inputs, tablas, etc.)
 │   ├── layout/          # Vistas y estructuras principales de la UI
 │   ├── App.js           # Componente raíz del proyecto
 │   ├── index.js         # Punto de entrada de React (renderiza <App /> en index.html)
 │   ├── index.css        # Estilos globales
 │   ├── reportWebVitals.js # Métricas de rendimiento (opcional)
 │   └── setupTests.js    # Configuración para pruebas unitarias
 │
 ├── .gitignore           # Archivos/carpetas ignorados por Git (node_modules, build, etc.)
 ├── package.json         # Dependencias y scripts del frontend
 ├── package-lock.json    # Versiones exactas de dependencias instaladas
 └── README.md            # Este archivo 
```

---

## Descripción rápida de cada parte

### `/public`
Contiene archivos estáticos que no pasan por el compilador de React.  
- `index.html`: plantilla principal en la que React monta la aplicación.  
- `favicon.ico`, `logo192.png`, `logo512.png`: íconos para navegador y dispositivos.  
- `manifest.json`: configuración para apps tipo PWA.  

### `/src`
Contiene todo el código fuente de React.  
- `components/`: aquí van los componentes reutilizables.  
- `layout/`: define la estructura de páginas/vistas.  
- `App.js`: componente raíz, organiza rutas y vistas principales.  
- `index.js`: punto de entrada que conecta React con el DOM (`public/index.html`).  
- `index.css`: estilos globales de la aplicación.  

### Archivos de configuración
- `.gitignore`: evita subir dependencias y archivos generados.  
- `package.json`: define dependencias y scripts (`npm start`, `npm build`, etc.).  
- `package-lock.json`: bloquea versiones exactas de dependencias instaladas.  

---

## Cómo levantar el frontend

1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Iniciar la aplicación en modo desarrollo:
   ```bash
   npm start
   ```

3. Generar build de producción:
   ```bash
   npm run build
   ```

---


