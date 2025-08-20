import React, { useState, useEffect, useRef } from "react";
import "../assets/scss/_03-Componentes/_PanelMensajesBodaAleyFaby.scss";
import { Heart, ChevronLeft, ChevronRight, X, Edit3, Trash2, Paperclip } from "react-feather";

// [COMPONENTE PRINCIPAL] Panel de mensajes para boda
// [PROPS] sala: define la sala de mensajes (por defecto 'boda')
function PanelMensajesBodaAleyFaby({ sala = 'boda' }) {
  // =========================================================
  // ESTADOS DEL COMPONENTE
  // =========================================================
  
  // [ESTADO] Almacena todos los mensajes cargados
  const [messages, setMessages] = useState([]);
  
  // [ESTADO] Texto del nuevo mensaje en formulario
  const [newMessage, setNewMessage] = useState("");
  
  // [ESTADO] Autor del mensaje en formulario
  const [author, setAuthor] = useState("");
  
  // [ESTADO] Controla visualmente el estado de envío (loading)
  const [isSending, setIsSending] = useState(false);
  
  // [ESTADO] Controla si se muestra el formulario
  const [showForm, setShowForm] = useState(true);
  
  // [ESTADO] Modo edición (true) o creación (false)
  const [editMode, setEditMode] = useState(false);
  
  // [ESTADO] Índice del mensaje actual en modo pantalla completa
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // [ESTADO] Controla el modo pantalla completa
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // [ESTADO] Archivo multimedia seleccionado
  const [mediaFile, setMediaFile] = useState(null);
  
  // [ESTADO] URL de previsualización del archivo multimedia
  const [mediaPreview, setMediaPreview] = useState(null);
  
  // [ESTADO] Tipo de archivo multimedia ('image' o 'video')
  const [mediaType, setMediaType] = useState(null);
  
  // [ESTADO] Intervalo de rotación en pantalla completa (milisegundos)
  const [rotationInterval, setRotationInterval] = useState(10000);

  // =========================================================
  // REFERENCIAS
  // =========================================================
  
  // [REF] Referencia al input de archivo para resetearlo
  const fileInputRef = useRef(null);
  
  // [REF] Referencia al contenedor de mensajes (no usado actualmente)
  const messagesContainerRef = useRef(null);
  
  // [REF] Referencia al intervalo de auto-scroll
  const autoScrollInterval = useRef(null);

  // =========================================================
  // EFECTOS (HOOKS DE CICLO DE VIDA)
  // =========================================================

  // [EFECTO] Cargar mensajes desde localStorage al montar el componente
  // [DEPENDENCIA] sala - se ejecuta cuando cambia la sala
  useEffect(() => {
    const savedMessages = localStorage.getItem(`weddingMessages_${sala}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages.slice(0, 50)); // Limitar a 50 mensajes
        }
      } catch (error) {
        console.error("Error parsing messages:", error);
      }
    }
  }, [sala]);

  // [EFECTO] Guardar mensajes en localStorage cuando cambian
  // [DEPENDENCIA] messages, sala - se ejecuta cuando cambian los mensajes o la sala
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

  // [EFECTO] Configurar intervalo de rotación automática en pantalla completa
  // [DEPENDENCIA] isFullscreen, messages.length, rotationInterval
  useEffect(() => {
    if (isFullscreen && messages.length > 0) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
      }, rotationInterval);
      return () => clearInterval(autoScrollInterval.current);
    }
  }, [isFullscreen, messages.length, rotationInterval]);

  // =========================================================
  // MANEJADORES DE EVENTOS
  // =========================================================

  // [MANEJADOR] Procesar selección de archivo multimedia
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño máximo (2MB imágenes, 5MB videos)
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

  // [MANEJADOR] Eliminar archivo multimedia seleccionado
  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // [MANEJADOR] Enviar formulario de nuevo mensaje
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !author.trim()) return;
    setIsSending(true);
    
    // Crear nuevo objeto de mensaje
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

    // Agregar mensaje al inicio y limitar a 50 mensajes
    setMessages(prev => [newMsg, ...prev].slice(0, 50));
    resetForm();
  };

  // [FUNCIÓN] Resetear formulario a estado inicial
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

  // [MANEJADOR] Eliminar mensaje por ID
  const handleDelete = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  // [MANEJADOR] Editar mensaje existente
  const handleEdit = (message) => {
    setNewMessage(message.text);
    setAuthor(message.author);
    if (message.mediaUrl) {
      setMediaPreview(message.mediaUrl);
      setMediaType(message.mediaType);
    }
    setEditMode(true);
    setShowForm(true);
    handleDelete(message.id); // Eliminar el mensaje original para reemplazarlo
  };

  // =========================================================
  // RENDERIZADO DEL COMPONENTE
  // =========================================================
  return (
    <div className={`panel-container ${isFullscreen ? 'fullscreen' : ''}`}>
      
      {/* ENCABEZADO - Muestra título y controles según modo */}
      <div className="panel-header">
        <h2 className="panel-title">
          <Heart className="title-icon" />
          Mensajes para los Novios
        </h2>

        {isFullscreen ? (
          <div className="panel-controls">
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
            <button 
              className="exit-btn"
              onClick={() => setIsFullscreen(false)}
            >
              Salir
            </button>
          </div>
        ) : (
          <button 
            className="fullscreen-btn"
            onClick={() => setIsFullscreen(true)}
          >
            Pantalla Completa
          </button>
        )}
      </div>

      {/* FORMULARIO - Solo visible en modo normal (no fullscreen) */}
      {!isFullscreen && showForm && (
        <form className="panel-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>{editMode ? 'Editar Mensaje' : 'Nuevo Mensaje'}</h3>
            <button
              type="button"
              className="close-btn"
              onClick={() => {
                setShowForm(false);
                setEditMode(false);
                removeMedia();
              }}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Campo para nombre del autor */}
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
          
          {/* Campo para texto del mensaje */}
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
          
          {/* Sección multimedia para adjuntar archivos */}
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
                  <img src={mediaPreview} alt="Vista previa" />
                ) : (
                  <video controls>
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
          
          {/* Botón de enviar/actualizar */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isSending}
          >
            {isSending ? 'Enviando...' : (editMode ? 'Actualizar' : 'Publicar')}
          </button>
        </form>
      )}

      {/* BOTÓN PARA MOSTRAR FORMULARIO - Solo cuando está oculto */}
      {!isFullscreen && !showForm && (
        <button
          className="show-form-btn"
          onClick={() => setShowForm(true)}
        >
          Escribir Mensaje
        </button>
      )}

      {/* CONTENEDOR DE MENSAJES - Vista diferente según modo */}
      <div
        className={`messages-container ${isFullscreen ? 'fullscreen-view' : ''}`}
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          // ESTADO VACÍO - Cuando no hay mensajes
          <div className="empty-state">
            <Heart size={48} />
            <p>No hay mensajes aún</p>
            <p>Sé el primero en enviar buenos deseos</p>
          </div>
        ) : isFullscreen ? (
          // VISTA PANTALLA COMPLETA - Muestra un mensaje a la vez
          <div className="fullscreen-message">
            {messages[currentIndex]?.mediaUrl && (
              <div className="message-media">
                {messages[currentIndex]?.mediaType === 'image' ? (
                  <img
                    src={messages[currentIndex].mediaUrl}
                    alt="Media del mensaje"
                  />
                ) : (
                  <video controls>
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
        ) : (
          // VISTA NORMAL - Grid de todos los mensajes
          <div className="messages-grid">
            {messages.map((message) => (
              <div key={message.id} className="message-card">
                {message.mediaUrl && (
                  <div className="message-media">
                    {message.mediaType === 'image' ? (
                      <img
                        src={message.mediaUrl}
                        alt="Media del mensaje"
                      />
                    ) : (
                      <video controls>
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

      {/* CONTROLES DE PANTALLA COMPLETA - Navegación entre mensajes */}
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

export default PanelMensajesBodaAleyFaby;