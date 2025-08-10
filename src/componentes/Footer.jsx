import React from "react";
import { Link } from "react-router-dom";
import "../assets/scss/_03-Componentes/_Footer.scss";
import { 
  BsInstagram, 
  BsFacebook, 
  BsTwitter, 
  BsWhatsapp,
  BsArrowUpCircle 
} from "react-icons/bs";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="footer">
      {/* Barra decorativa superior */}
      <div className="footer-neon-bar"></div>
      
      {/* Contenido principal */}
      <div className="footer-content">
        {/* Sección de redes sociales */}
        <div className="social-section">
          <div className="social-links">
            <div className="social-link">
              <BsInstagram className="social-icon" />
              {/* <span>#Fabiola&Alejandro</span> */}
            </div>
            
            <div className="social-link">
              <BsFacebook className="social-icon" />
              {/* <span>#BodaFabyAle</span> */}
            </div>
            
            <div className="social-link">
              <BsTwitter className="social-icon" />
              {/* <span>#NosCasamos</span> */}
            </div>
            
            <div className="social-link whatsapp">
              <BsWhatsapp className="social-icon" />
              {/* <span>#ConfirmarAsistencia</span> */}
            </div>
          </div>
          
        
        </div>
        
        {/* Botón para volver arriba */}
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <BsArrowUpCircle className="scroll-top-icon" />
        </button>
      </div>
      
      {/* Créditos */}
      <div className="credits">
        <a 
          href="https://alejandrobavaro.github.io/gondraworld-dev/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="credits-link"
        >
          <span className="sparkle">✧</span> 
          <span>Desarrollado por Gondra World</span> 
          <span className="sparkle">✧</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;