import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsList, BsChatLeftTextFill, BsGeoAltFill } from "react-icons/bs";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/mensajes", icon: <BsChatLeftTextFill />, label: "Mensajes" },
    { path: "/contacto", icon: <BsGeoAltFill />, label: "Contacto" }
  ];

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-decoration-top"></div>
      <Navbar expand="lg" className="header-navbar" expanded={isMobileMenuOpen}>
        <Container className="header-container">
          <Navbar.Brand as={Link} to="/" className="header-logo">
            <img
              src="../../img/02-logos/logomsjpantallaeventos3.png"
              alt="Logo Boda"
              className="logo-image"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="ms-auto"
            onClick={handleToggleMobileMenu}
          >
            <BsList className="menu-icon" />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="nav-links">
              {navLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`nav-link ${
                    location.pathname === link.path ? "active" : ""
                  }`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="header-decoration-bottom"></div>
    </header>
  );
};

export default Header;