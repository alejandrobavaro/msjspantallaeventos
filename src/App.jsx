import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './assets/scss/estilo.scss';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Contacto from './componentes/Contacto';
import LinkWebMensajesNovios from './componentes/LinkWebMensajesNovios';
import EventosPanel from './componentes/EventosPanel';
import Home from './componentes/Home';

function App() {
  return (
    <Router>
      {/* Contenedor principal con nueva clase para el fondo */}
      <div className="app-container app-bg-pattern">
        <Header />

        {/* Main content con nuevo estilo */}
        <main className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inicio" element={<Home />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/eventos" element={<EventosPanel />} />
              <Route path="/mensajes-boda" element={<LinkWebMensajesNovios sala="boda" />} />
              <Route path="/mensajes-after" element={<LinkWebMensajesNovios sala="after" />} />
              <Route path="/mensajes-despedida" element={<LinkWebMensajesNovios sala="despedida" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;