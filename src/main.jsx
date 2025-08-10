import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// =========================================================
// RENDERIZACIÓN DE LA APLICACIÓN
// =========================================================

// Crea el root en el elemento con ID 'root' en el index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode ayuda a identificar problemas potenciales en el desarrollo.
  <React.StrictMode>
    {/* App es el componente raíz que gestiona las rutas y la estructura */}
    <App />
  </React.StrictMode>
);