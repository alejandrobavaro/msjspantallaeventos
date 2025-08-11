import React, { useState, useEffect, useRef } from "react";
import "../assets/scss/_03-Componentes/_PanelMensajesBodaAleyFaby.scss";
import { Heart, ChevronLeft, ChevronRight, X, Edit3, Trash2, Paperclip } from "react-feather";

function PanelMensajesBodaAleyFaby({ sala = 'boda' }) {
  // Estados del componente
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [rotationInterval, setRotationInterval] = useState(10000);

  // Referencias
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Efectos
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

  useEffect(() => {
    if (isFullscreen && messages.length > 0) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
      }, rotationInterval);
      return () => clearInterval(autoScrollInterval.current);
    }
  }, [isFullscreen, messages.length, rotationInterval]);

  // Manejadores
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

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  const handleDelete = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

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

  return (
    <div className={`panel-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Encabezado */}
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

      {/* Formulario */}
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
          
          <button
            type="submit"
            className="submit-btn"
            disabled={isSending}
          >
            {isSending ? 'Enviando...' : (editMode ? 'Actualizar' : 'Publicar')}
          </button>
        </form>
      )}

      {/* Botón mostrar formulario */}
      {!isFullscreen && !showForm && (
        <button
          className="show-form-btn"
          onClick={() => setShowForm(true)}
        >
          Escribir Mensaje
        </button>
      )}

      {/* Contenedor de mensajes */}
      <div
        className={`messages-container ${isFullscreen ? 'fullscreen-view' : ''}`}
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

      {/* Controles de pantalla completa */}
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