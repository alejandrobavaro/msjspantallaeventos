// ===============================================
// Componente EventosPanel
// ===============================================

import React from 'react'; // Importa React para usar JSX
import { Link } from 'react-router-dom'; // Importa Link para navegación interna
import "../assets/scss/_03-Componentes/_EventosPanel.scss"; // Importa estilos específicos del componente

/**
 * Componente EventosPanel - Muestra los eventos disponibles con sus respectivos paneles de mensajes
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * 1. Lista eventos con imagen, nombre, fecha y descripción.
 * 2. Si el evento está activo → muestra botón para entrar y link para compartir.
 * 3. Si está inactivo → muestra mensaje "Panel disponible pronto".
 * 4. Diseño responsive siguiendo la estética de Contacto.jsx.
 */
function EventosPanel() {
  // ===============================================
  // Datos de eventos (en el futuro podrían venir de una API)
  // ===============================================
  const eventos = [
    {
      id: 'boda', // Identificador único
      nombre: 'Boda Ale y Fabi', // Título del evento
      fecha: '23 de Noviembre, 2025', // Fecha del evento
      descripcion: 'Mensajea a los novios en vivo en pantalla grande', // Descripción breve
      link: '/mensajes-boda', // Ruta interna para el panel
      activo: true, // Estado activo/inactivo
      imagen: '/img/04-img-galeria1/banereventofabiyale1.png' // Imagen de portada
    },
    {
      id: 'despedida',
      nombre: 'Despedida de Soltero',
      fecha: 'Octubre, 2025',
      descripcion: 'Última fiesta antes del gran día para él',
      link: '/mensajes-despedida',
      activo: false,
   imagen: '/img/04-img-galeria1/panelproximamente3.png'
    },
    {
      id: 'despedida',
      nombre: 'Despedida de Soltera',
      fecha: 'Octubre, 2023',
      descripcion: 'Última fiesta antes del gran día para ella',
      link: '/mensajes-despedida',
      activo: false,
 imagen: '/img/04-img-galeria1/panelproximamente2.png'
    }
  ];

  // ===============================================
  // Render del componente
  // ===============================================
  return (
    <div className="eventos-container">
      
      {/* Encabezado principal */}
      <h1 className="section-title">
        Eventos y Mensajes en Vivo
      </h1>

      {/* Subtítulo introductorio */}
      <p className="section-subtitle intro-text">
        Selecciona un evento para ver o enviar mensajes en vivo.
        Comparte el link con otros invitados para que todos participen.
      </p>
      
      {/* Grid de tarjetas de eventos */}
      <div className="eventos-grid">
        {eventos.map(evento => (
          <div 
            key={evento.id} 
            className={`evento-card ${!evento.activo ? 'inactivo' : ''}`}
          >
            
            {/* Imagen de portada del evento */}
            <div 
              className="evento-imagen" 
              style={{ backgroundImage: `url(${evento.imagen})` }}
            ></div>
            
            {/* Información textual del evento */}
            <div className="evento-info">
              <h3 className="evento-nombre">{evento.nombre}</h3>
              <p className="evento-fecha">{evento.fecha}</p>
              <p className="evento-desc">{evento.descripcion}</p>
              
              {/* Render condicional según estado activo/inactivo */}
              {evento.activo ? (
                <>
                  {/* Botón para acceder al panel de mensajes */}
                  <Link to={evento.link} className="evento-btn">
                    Entrar al Panel
                  </Link>
                  
                  {/* Sección para compartir link */}
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
                // Mensaje si el evento está inactivo
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
