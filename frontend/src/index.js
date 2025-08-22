import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Estilos PrimeReact (tema + core + iconos + utilidades)
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Estilos del layout
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
