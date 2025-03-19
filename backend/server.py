from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain_community.document_loaders import WebBaseLoader
from langchain_groq import ChatGroq

# Carregar variáveis do .env
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("A chave da API GROQ_API_KEY não está definida no .env")

# Configurar o chat com o modelo Groq
chat = ChatGroq(model="llama-3.3-70b-versatile")

# Carregar o conteúdo do site
loader = WebBaseLoader("https://fsn-5-grupo-02-autopecas.vercel.app/")
documentos_site = loader.load()
documento = ""
for doc in documentos_site:
    documento += doc.page_content

app = Flask(__name__)
CORS(app)

# Função para gerar resposta do bot
def resposta_bot(mensagens, documento):
    try:
        message_system = """Você é um assistente amigável chamado OlimpIA que utiliza as seguintes informações para formular as suas respostas de forma simples, resumida e direta, mas com os detalhes necessários: {informacoes}."""

        # Garantir que as mensagens estejam no formato correto
        mensagens_modelo = [("system", message_system)]
        for msg in mensagens:
            if isinstance(msg, dict):  # Verificar se a mensagem é um dicionário
                sender = msg.get('sender', 'user')  # Obter o sender (usuário ou bot)
                content = msg.get('content', '')  # Obter o conteúdo da mensagem
                
                # Ajuste o tipo da mensagem para um dos aceitos
                if sender == 'bot':
                    sender = 'assistant'  # Se for 'bot', altere para 'assistant'
                
                mensagens_modelo.append((sender, content))  # Adicionar a mensagem ao modelo
            else:
                print(f"Mensagem inválida: {msg}")  # Mensagem inválida
        
        # Gerar a resposta com o modelo
        template = ChatPromptTemplate.from_messages(mensagens_modelo)
        chain = template | chat
        resposta = chain.invoke({"informacoes": documento}).content
        
        return resposta
    except Exception as e:
        print(f"Erro ao gerar resposta: {e}")
        return "Desculpe, houve um erro ao processar sua mensagem."

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    try:
        data = request.json
        mensagens = data.get("mensagens", [])
        resposta = resposta_bot(mensagens, documento)
        return jsonify({"resposta": resposta})
    except Exception as e:
        print(f"Erro ao processar requisição: {e}")
        return jsonify({"resposta": "Erro no servidor."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)