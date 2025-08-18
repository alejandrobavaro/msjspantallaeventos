import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/scss/_03-Componentes/_Contacto.scss";
import { BsEnvelope, BsSend, BsQuestionCircle } from "react-icons/bs";

const Contacto = () => {
  // [SECCIÓN 1] Configuración del Slider
  // -----------------------------------
  // Configura las propiedades del carrusel de imágenes
  // - Transición suave (fade)
  // - Autoplay cada 5 segundos
  // - Sin flechas de navegación
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: true
  };

  // [SECCIÓN 2] Datos del Componente
  // --------------------------------
  // Array con las rutas de las imágenes de demostración
  const messageScreenshots = [
    "/img/02-logos/logomsjpantallaeventos4b.png",
    "/img/02-logos/logomsjpantallaeventos4c.png",
    "img/02-logos/logomsjpantallaeventos4d.png",
    "/img/02-logos/logomsjpantallaeventos4a.png"
  ];

  // [SECCIÓN 3] Renderizado del Componente
  // -------------------------------------
  return (
    <div className="contacto-container">
      {/* [SUBSECCIÓN 3.1] Sección de Información - Preguntas Frecuentes */}
      <section className="info-section">
        <div className="info-content">
          {/* Título principal de la sección */}
          <h2 className="section-title">
            <BsQuestionCircle className="title-icon" /> 
            Soporte del Sistema de Mensajes
          </h2>
          
          {/* Grid de tarjetas con preguntas frecuentes */}
          {/* <div className="features-grid">
   
            <div className="feature-card">
              <h3 className="feature-title">¿Cómo funciona?</h3>
              <p className="feature-text">Envía mensajes que se mostrarán en pantalla durante el evento</p>
            </div>
            
            <div className="feature-card">
              <h3 className="feature-title">¿Dónde se ven?</h3>
              <p className="feature-text">Los mensajes aparecerán en las pantallas principales del lugar</p>
            </div>
            
            <div className="feature-card">
              <h3 className="feature-title">¿Puedo adjuntar fotos?</h3>
              <p className="feature-text">Sí, puedes subir una imagen junto con tu mensaje</p>
            </div>
            
            <div className="feature-card">
              <h3 className="feature-title">¿Quién puede verlos?</h3>
              <p className="feature-text">Todos los invitados podrán ver los mensajes en las pantallas</p>
            </div>
          </div> */}
        </div>
      </section>

      {/* [SUBSECCIÓN 3.2] Sección de Formulario de Contacto */}
      <section className="form-section">
        <div className="form-container">
          {/* Título del formulario */}
          <h2 className="section-title">
            <BsEnvelope className="title-icon" /> 
            Contacta al Soporte Técnico
          </h2>
          
          {/* Subtítulo descriptivo */}
          <p className="section-subtitle">
            ¿Problemas con el sistema de mensajes? Escríbenos
          </p>
          
          {/* Formulario de contacto */}
          <form
            className="contact-form"
            action="https://formspree.io/f/xbjnlgzz"
            target="_blank"
            method="post"
          >
            {/* Grupo de campo para el nombre */}
            <div className="form-group">
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                required
                className="form-input"
              />
            </div>
            
            {/* Grupo de campo para el email */}
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo electrónico"
                required
                className="form-input"
              />
            </div>
            
            {/* Grupo de campo para el mensaje */}
            <div className="form-group">
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                placeholder="Describe el problema que estás experimentando..."
                required
                className="form-textarea"
              />
            </div>
            
            {/* Botón de envío del formulario */}
            <button type="submit" className="submit-btn">
              <BsSend className="btn-icon" /> Enviar Consulta
            </button>
          </form>
        </div>
      </section>

      {/* [SUBSECCIÓN 3.3] Sección de Demostración - Carrusel */}
      <section className="demo-section">
        <div className="slider-container">
          {/* Componente Slider con configuración */}
          <Slider {...sliderSettings} className="demo-slider">
            {/* Mapeo de imágenes de demostración */}
            {messageScreenshots.map((photo, index) => (
              <div key={index} className="slider-item">
                <img 
                  src={photo} 
                  alt={`Demo del sistema ${index + 1}`} 
                  className="demo-photo"
                />
                {/* Overlay para efecto visual */}
                <div className="photo-overlay"></div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default Contacto;