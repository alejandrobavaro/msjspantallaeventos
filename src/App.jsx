import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './assets/scss/estilo.scss';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Contacto from './componentes/Contacto';
import PanelMensajesBodaAleyFaby from './componentes/PanelMensajesBodaAleyFaby';
import EventosPanel from './componentes/EventosPanel';
import Home from './componentes/Home';

function App() {
  return (
    // [1] Configuración del Router principal
    // El componente Router de react-router-dom permite la navegación entre páginas
    // sin recargar la aplicación (SPA - Single Page Application)
    <Router>
      {/* [2] Contenedor principal de la aplicación
          - app-container: Establece la estructura flexbox vertical
          - app-bg-pattern: Aplica el patrón de fondo decorativo */}
      <div className="app-container app-bg-pattern">
        {/* [3] Componente Header
            - Se muestra en todas las páginas
            - Normalmente contiene el menú de navegación y el logo */}
        <Header />

        {/* [4] Contenido principal dinámico
            - main-content: Contenedor flexible que crece para ocupar el espacio disponible
            - Cambia según la ruta activa */}
        <main className="main-content">
          {/* [5] Wrapper del contenido
              - content-wrapper: Provee márgenes y padding consistentes
              - Contiene el sistema de rutas */}
          <div className="content-wrapper">
            {/* [6] Sistema de enrutamiento
                - Routes: Contenedor de todas las rutas de la aplicación
                - Cada Route define una ruta y el componente que debe mostrarse */}
            <Routes>
              {/* [6.1] Ruta para la página de inicio */}
              <Route path="/" element={<Home />} />
              
              {/* [6.2] Ruta alternativa para la página de inicio */}
              <Route path="/inicio" element={<Home />} />
              
              {/* [6.3] Ruta para la página de contacto */}
              <Route path="/contacto" element={<Contacto />} />
              
              {/* [6.4] Ruta para el panel de eventos */}
              <Route path="/eventos" element={<EventosPanel />} />
              
              {/* [6.5] Ruta para los mensajes de boda con parámetro sala="boda" */}
              <Route path="/mensajes-boda" element={<PanelMensajesBodaAleyFaby sala="boda" />} />
              
              {/* [6.6] Ruta para los mensajes del after party */}
              <Route path="/mensajes-after" element={<PanelMensajesBodaAleyFaby sala="after" />} />
              
              {/* [6.7] Ruta para los mensajes de despedida */}
              <Route path="/mensajes-despedida" element={<PanelMensajesBodaAleyFaby sala="despedida" />} />
              
              {/* [6.8] Ruta comodín - Redirige a la página principal
                  si no coincide con ninguna ruta definida */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        {/* [7] Componente Footer
            - Se muestra en todas las páginas
            - Normalmente contiene información de contacto, enlaces útiles, etc. */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;