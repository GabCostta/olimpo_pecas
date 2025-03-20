import { useState, useRef, useEffect } from "react";
import '@styles/Components/FloatingChat/FloatingChat.css'

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [pergunta, setPergunta] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [mensagens, isOpen]);

  const enviarPergunta = async () => {
    if (!pergunta.trim()) return;

    const novaMensagemUsuario = { sender: "user", content: pergunta };
    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setPergunta("");

    try {
      const resposta = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: [...mensagens, novaMensagemUsuario] }),
      });

      if (!resposta.ok) throw new Error("Erro ao enviar a pergunta");

      const dados = await resposta.json();
      setMensagens((prev) => [...prev, { sender: "bot", content: dados.resposta }]);
    } catch (erro) {
      console.error("Erro:", erro);
      setMensagens((prev) => [...prev, { sender: "bot", content: "Erro ao processar sua pergunta." }]);
    }
  };

  return (
    <div className="floating-chat-container">
      <button className="chat-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "❌" : "💬"}
      </button>

      {isOpen && (
        <div className="chat-box">
          <div className="chat-header"><span>OlimpIA</span></div>
          <div className="chat-messages">
            {mensagens.length === 0 ? (
              <div className="empty-messages">Nenhuma mensagem ainda. Comece a conversar!</div>
            ) : (
              mensagens.map((msg, index) => (
                <div key={index} className={`message-wrapper ${msg.sender === "user" ? "user" : "bot"}`}>
                  <div className="avatar">{msg.sender === "user" ? "👤" : "🤖"}</div>
                  <div className="message">
                    {msg.content}
                    <span className="message-time">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <textarea
              className="message-input"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviarPergunta();
                }
              }}
              placeholder="Digite sua pergunta..."
            />
            <button className="send-button" onClick={enviarPergunta}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
