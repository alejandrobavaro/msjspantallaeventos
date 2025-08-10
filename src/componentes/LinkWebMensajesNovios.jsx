import React, { useState, useEffect, useRef } from "react";
import "../assets/scss/_03-Componentes/_LinkWebMensajesNovios.scss";
import { Heart, ChevronLeft, ChevronRight, X, Edit3, Trash2, Paperclip } from "react-feather";

function LinkWebMensajesNovios({ sala = 'boda' }) {
  // =========================================================
  // SECCIÓN 1: ESTADOS - Manejo de todos los estados del componente
  // =========================================================
  const [messages, setMessages] = useState([]); // Almacena la lista de mensajes
  const [newMessage, setNewMessage] = useState(""); // Texto del mensaje en formulario
  const [author, setAuthor] = useState(""); // Autor del mensaje en formulario
  const [isSending, setIsSending] = useState(false); // Estado de carga durante envío
  const [showForm, setShowForm] = useState(true); // Controla visibilidad del formulario
  const [editMode, setEditMode] = useState(false); // Modo edición activo/inactivo
  const [currentIndex, setCurrentIndex] = useState(0); // Índice para mensaje en pantalla completa
  const [isFullscreen, setIsFullscreen] = useState(false); // Controla modo pantalla completa
  const [mediaFile, setMediaFile] = useState(null); // Archivo multimedia seleccionado
  const [mediaPreview, setMediaPreview] = useState(null); // URL de vista previa del media
  const [mediaType, setMediaType] = useState(null); // Tipo de media (image/video)
  const [rotationInterval, setRotationInterval] = useState(10000); // Intervalo de rotación (ms)

  // =========================================================
  // SECCIÓN 2: REFERENCIAS - Acceso a elementos del DOM
  // =========================================================
  const fileInputRef = useRef(null); // Referencia al input de archivo
  const messagesContainerRef = useRef(null); // Referencia al contenedor de mensajes
  const autoScrollInterval = useRef(null); // Referencia al intervalo de rotación

  // =========================================================
  // SECCIÓN 3: EFECTOS - Operaciones secundarias
  // =========================================================

  // Efecto 1: Cargar mensajes guardados al iniciar
  useEffect(() => {
    const savedMessages = localStorage.getItem(`weddingMessages_${sala}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages.slice(0, 50));
        }
      } catch (error) {
        console.error("Error parsing messages:", error);
      }
    }
  }, [sala]);

  // Efecto 2: Guardar mensajes cuando cambian
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const messagesToSave = messages.slice(0, 50).map(msg => ({
          id: msg.id,
          text: msg.text,
          author: msg.author,
          date: msg.date,
          mediaUrl: msg.mediaUrl?.startsWith('http') ? msg.mediaUrl : null,
          mediaType: msg.mediaType
        }));
        localStorage.setItem(`weddingMessages_${sala}`, JSON.stringify(messagesToSave));
      } catch (error) {
        console.error("Error saving messages:", error);
        if (error.name === 'QuotaExceededError') {
          localStorage.removeItem(`weddingMessages_${sala}`);
          alert("Límite de almacenamiento alcanzado. Mensajes antiguos eliminados.");
        }
      }
    }
  }, [messages, sala]);

  // Efecto 3: Configurar intervalo de rotación en pantalla completa
  useEffect(() => {
    if (isFullscreen && messages.length > 0) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
      }, rotationInterval);
      return () => clearInterval(autoScrollInterval.current);
    }
  }, [isFullscreen, messages.length, rotationInterval]);

  // =========================================================
  // SECCIÓN 4: MANEJADORES - Funciones para interactuar con el componente
  // =========================================================

  // Manejador 1: Cambio de archivo multimedia
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = file.type.startsWith('image/') ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`El archivo es demasiado grande. Máximo permitido: ${maxSize/(1024*1024)}MB`);
      return;
    }

    setMediaFile(file);
    if (file.type.startsWith('image/')) {
      setMediaType('image');
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
      const videoURL = URL.createObjectURL(file);
      setMediaPreview(videoURL);
    }
  };

  // Manejador 2: Eliminar multimedia seleccionado
  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Manejador 3: Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !author.trim()) return;
    setIsSending(true);
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      author: author,
      date: new Date().toLocaleDateString("es-AR", {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      mediaUrl: mediaPreview,
      mediaType: mediaType,
      createdAt: new Date().getTime()
    };

    setMessages(prev => [newMsg, ...prev].slice(0, 50));
    resetForm();
  };

  // Manejador 4: Reiniciar formulario
  const resetForm = () => {
    setNewMessage("");
    setAuthor("");
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setIsSending(false);
    setShowForm(false);
    setCurrentIndex(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Manejador 5: Eliminar mensaje
  const handleDelete = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  // Manejador 6: Editar mensaje
  const handleEdit = (message) => {
    setNewMessage(message.text);
    setAuthor(message.author);
    if (message.mediaUrl) {
      setMediaPreview(message.mediaUrl);
      setMediaType(message.mediaType);
    }
    setEditMode(true);
    setShowForm(true);
    handleDelete(message.id);
  };

  // =========================================================
  // SECCIÓN 5: RENDERIZADO - Estructura visual del componente
  // =========================================================

  return (
    <div className={`messages-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* ENCABEZADO - Título y controles principales */}
      <div className="messages-header">
        <h2>Mensajes para los Novios</h2>

        {isFullscreen ? (
          <>
            {/* Controles izquierda (intervalo) */}
            <div className="left-controls">
              <div className="rotation-control">
                <span>Intervalo: </span>
                <select
                  value={rotationInterval}
                  onChange={(e) => setRotationInterval(Number(e.target.value))}
                >
                  <option value={5000}>5 segundos</option>
                  <option value={10000}>10 segundos</option>
                  <option value={15000}>15 segundos</option>
                  <option value={20000}>20 segundos</option>
                  <option value={30000}>30 segundos</option>
                </select>
              </div>
            </div>

            {/* Botón derecha (salir) */}
            <button className="exit-fullscreen-btn" onClick={() => setIsFullscreen(false)}>
              Salir
            </button>
          </>
        ) : (
          <button className="fullscreen-btn" onClick={() => setIsFullscreen(true)}>
            Pantalla Completa
          </button>
        )}
      </div>

      {/* FORMULARIO - Para crear/editar mensajes (solo en modo normal) */}
      {!isFullscreen && showForm && (
        <form className="message-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>{editMode ? 'Editar Mensaje' : 'Nuevo Mensaje'}</h3>
            <button
              type="button"
              className="close-form"
              onClick={() => {
                setShowForm(false);
                setEditMode(false);
                removeMedia();
              }}
            >
              <X size={20} />
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="author">Tu Nombre</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              maxLength={30}
              placeholder="Ej: María y Juan"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Tu Mensaje</label>
            <textarea
              id="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
              maxLength={200}
              rows={4}
              placeholder="Escribe tu mensaje de amor, consejo o buenos deseos..."
            />
            <div className="char-counter">{newMessage.length}/200</div>
          </div>
          <div className="media-section">
            <label className="media-label">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaChange}
                accept="image/*, video/*"
                style={{ display: 'none' }}
              />
              <Paperclip size={18} />
              <span>Adjuntar foto o video</span>
            </label>
            {mediaPreview && (
              <div className="media-preview">
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                ) : (
                  <video controls style={{ maxWidth: '100%', maxHeight: '300px' }}>
                    <source src={mediaPreview} type={mediaFile?.type} />
                  </video>
                )}
                <button
                  type="button"
                  className="remove-media"
                  onClick={removeMedia}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={isSending}
          >
            {isSending ? 'Enviando...' : (editMode ? 'Actualizar' : 'Publicar')}
          </button>
        </form>
      )}

      {/* BOTÓN MOSTRAR FORMULARIO - Solo cuando el formulario está oculto */}
      {!isFullscreen && !showForm && (
        <button
          className="show-form-btn"
          onClick={() => setShowForm(true)}
        >
          Escribir Mensaje
        </button>
      )}

      {/* CONTENEDOR MENSAJES - Muestra diferente según el modo */}
      <div
        className={`messages-display ${isFullscreen ? 'fullscreen-display' : ''}`}
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          <div className="empty-state">
            <Heart size={48} />
            <p>No hay mensajes aún</p>
            <p>Sé el primero en enviar buenos deseos</p>
          </div>
        ) : isFullscreen ? (
          <div className="fullscreen-message">
            <div className="message-content">
              {messages[currentIndex]?.mediaUrl && (
                <div className="message-media">
                  {messages[currentIndex]?.mediaType === 'image' ? (
                    <img
                      src={messages[currentIndex].mediaUrl}
                      alt="Media del mensaje"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '60vh',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <video
                      controls
                      style={{
                        maxWidth: '100%',
                        maxHeight: '60vh',
                        width: 'auto',
                        height: 'auto'
                      }}
                    >
                      <source src={messages[currentIndex].mediaUrl} />
                    </video>
                  )}
                </div>
              )}
              <p className="message-text">{messages[currentIndex]?.text}</p>
              <div className="message-author">
                - {messages[currentIndex]?.author}
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-grid">
            {messages.map((message) => (
              <div key={message.id} className="message-card">
                {message.mediaUrl && (
                  <div className="message-media">
                    {message.mediaType === 'image' ? (
                      <img
                        src={message.mediaUrl}
                        alt="Media del mensaje"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <video
                        controls
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          width: 'auto',
                          height: 'auto'
                        }}
                      >
                        <source src={message.mediaUrl} />
                      </video>
                    )}
                  </div>
                )}
                <p className="message-text">{message.text}</p>
                <div className="message-footer">
                  <span className="message-author">- {message.author}</span>
                  <div className="message-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(message)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTROLES PANTALLA COMPLETA - Navegación entre mensajes */}
      {isFullscreen && messages.length > 1 && (
        <div className="fullscreen-controls">
          <button
            className="control-btn"
            onClick={() => setCurrentIndex(prev =>
              prev === 0 ? messages.length - 1 : prev - 1
            )}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="counter">
            {currentIndex + 1}/{messages.length}
          </div>
          <button
            className="control-btn"
            onClick={() => setCurrentIndex(prev =>
              (prev + 1) % messages.length
            )}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

export default LinkWebMensajesNovios;
