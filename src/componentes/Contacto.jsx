import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/scss/_03-Componentes/_Contacto.scss";
import { BsEnvelope, BsSend, BsQuestionCircle } from "react-icons/bs";

const Contacto = () => {
  // Configuración del slider
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

  // Fotos de ejemplo del sistema de mensajes
  const messageScreenshots = [
    "/img/02-logos/logomsjpantallaeventos4.png",
    "/img/02-logos/logomsjpantallaeventos2.png",
    "img/02-logos/logomsjpantallaeventos1.png"
  ];

  return (
    <div className="contacto-container">
      {/* Sección de información */}
      <section className="info-section">
        <div className="info-content">
          <h2 className="section-title">
            <BsQuestionCircle className="title-icon" /> 
            Soporte del Sistema de Mensajes
          </h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3>¿Cómo funciona?</h3>
              <p>Envía mensajes que se mostrarán en pantalla durante el evento</p>
            </div>
            
            <div className="feature-card">
              <h3>¿Dónde se ven?</h3>
              <p>Los mensajes aparecerán en las pantallas principales del lugar</p>
            </div>
            
            <div className="feature-card">
              <h3>¿Puedo adjuntar fotos?</h3>
              <p>Sí, puedes subir una imagen junto con tu mensaje</p>
            </div>
            
            <div className="feature-card">
              <h3>¿Quién puede verlos?</h3>
              <p>Todos los invitados podrán ver los mensajes en las pantallas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de formulario de contacto */}
      <section className="form-section">
        <div className="form-container">
          <h2 className="section-title">
            <BsEnvelope className="title-icon" /> 
            Contacta al Soporte Técnico
          </h2>
          
          <p className="section-subtitle">
            ¿Problemas con el sistema de mensajes? Escríbenos
          </p>
          
          <form
            className="contact-form"
            action="https://formspree.io/f/xbjnlgzz"
            target="_blank"
            method="post"
          >
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
            
            <button type="submit" className="submit-btn">
              <BsSend className="btn-icon" /> Enviar Consulta
            </button>
          </form>
        </div>
      </section>

      {/* Slider de demostración */}
      <section className="demo-section">
        {/* <h2 className="section-title">Así se ven los mensajes en pantalla</h2> */}
        <div className="slider-container">
          <Slider {...sliderSettings} className="demo-slider">
            {messageScreenshots.map((photo, index) => (
              <div key={index} className="slider-item">
                <img 
                  src={photo} 
                  alt={`Demo del sistema ${index + 1}`} 
                  className="demo-photo"
                />
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