import React from 'react';
import EventosPanel from './EventosPanel';
import "../assets/scss/_03-Componentes/_Home.scss";

/**
 * Componente Home - Página principal que muestra el panel de eventos
 * 
 * Funcionalidades:
 * - Muestra un banner/hero inicial
 * - Incluye el panel de eventos
 * - Diseño responsive mobile-first
 */
function Home() {
  return (
    <div className="home-container">
      {/* Banner/Hero inicial */}
      {/* <section className="hero-section">
        <h1>Bienvenidos a nuestra boda</h1>
        <p>Comparte tus mensajes y buenos deseos con nosotros</p>
      </section> */}

      {/* Panel de eventos */}
      <EventosPanel />
    </div>
  );
}

export default Home;