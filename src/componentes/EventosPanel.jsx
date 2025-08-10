// src/componentes/EventosPanel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/scss/_03-Componentes/_EventosPanel.scss";

/**
 * Componente EventosPanel - Muestra los eventos disponibles con sus respectivos paneles de mensajes
 * 
 * Funcionalidades:
 * - Lista los eventos con su información básica
 * - Proporciona links para acceder a cada panel de mensajes
 * - Permite copiar el link de cada evento para compartirlo
 * - Diseño responsive mobile-first
 */
function EventosPanel() {
  // Datos de los eventos (pueden venir de una API en el futuro)
  const eventos = [
    {
      id: 'boda',
      nombre: 'Boda Principal',
      fecha: '15 de Diciembre, 2023',
      descripcion: 'Ceremonia y recepción de nuestra boda',
      link: '/mensajes-boda',
      activo: true,
      imagen: '/img/eventos/boda.jpg'
    },
    {
      id: 'after',
      nombre: 'After Party',
      fecha: '15 de Diciembre, 2023 - 23:00hs',
      descripcion: 'Fiesta después de la recepción',
      link: '/mensajes-after',
      activo: false,
      imagen: '/img/eventos/after.jpg'
    },
    {
      id: 'despedida',
      nombre: 'Despedida de Solteros',
      fecha: '10 de Diciembre, 2023',
      descripcion: 'Última fiesta antes del gran día',
      link: '/mensajes-despedida',
      activo: false,
      imagen: '/img/eventos/despedida.jpg'
    }
  ];

  return (
    <div className="eventos-container">
      {/* Encabezado del panel */}
      <h1>Eventos y Mensajes en Vivo</h1>
      <p className="intro-text">
        Selecciona un evento para ver o enviar mensajes en vivo. 
        Comparte el link con otros invitados para que todos participen.
      </p>
      
      {/* Grid de eventos */}
      <div className="eventos-grid">
        {eventos.map(evento => (
          <div key={evento.id} className={`evento-card ${!evento.activo ? 'inactivo' : ''}`}>
            {/* Imagen del evento */}
            <div className="evento-imagen" style={{ backgroundImage: `url(${evento.imagen})` }}></div>
            
            {/* Información del evento */}
            <div className="evento-info">
              <h3>{evento.nombre}</h3>
              <p className="evento-fecha">{evento.fecha}</p>
              <p className="evento-desc">{evento.descripcion}</p>
              
              {/* Sección interactiva según estado del evento */}
              {evento.activo ? (
                <>
                  {/* Botón para acceder al panel de mensajes */}
                  <Link to={evento.link} className="evento-btn">
                    Entrar al Panel
                  </Link>
                  
                  {/* Sección para compartir el link */}
                  <div className="share-section">
                    <p>Compartir este evento:</p>
                    <input 
                      type="text" 
                      value={`${window.location.origin}${evento.link}`}
                      readOnly 
                      className="share-link"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}${evento.link}`);
                        alert('¡Link copiado al portapapeles!');
                      }}
                      className="copy-btn"
                    >
                      Copiar Link
                    </button>
                  </div>
                </>
              ) : (
                <div className="evento-inactivo-msg">
                  Panel disponible pronto
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventosPanel;