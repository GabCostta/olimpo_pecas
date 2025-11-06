# Sistema de Gestão de Lojas

**Sistema web para gerenciamento de vendedores e clientes de lojas, com integração automática ao n8n para notificações via E-mail.**

## O que é este projeto?

Este é um sistema de cadastro e gestão desenvolvido especificamente para redes de lojas. Permite:

- **Cadastrar vendedores** das diferentes unidades 
- **Cadastrar clientes** e associá-los a múltiplos vendedores
- **Visualizar e filtrar** dados de vendedores e clientes
- **Notificações automáticas** via webhooks n8n para cada novo cadastro

## Funcionalidades Principais

### 🏪 Gestão de Vendedores
- Cadastro com nome e loja específica
- Listagem e filtros por loja
- Notificação automática no n8n

### 👥 Gestão de Clientes  
- Cadastro com associação a múltiplos vendedores
- Relacionamento many-to-many (cliente ↔ vendedores)
- Visualização completa dos relacionamentos

### 📊 Painel Administrativo
- Visualização de todas as tabelas
- Filtros por nome em tempo real
- Interface limpa e responsiva

## Instalação Rápida

### Pré-requisitos
- Python 3.7+
- PostgreSQL Server
- n8n (opcional, para notificações)

### 1. Configurar Banco
```bash
# PostgreSQL com usuário postgres e senha 1234
# Ou ajustar credenciais em backend/database.py
```

### 2. Instalar e Executar
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Acessar
```
http://localhost:5000
```

## Páginas do Sistema

| Rota | Descrição |
|------|----------|
| `/` | Filtros e visualização de dados |
| `/cadastro-vendedor` | Formulário de cadastro de vendedores |
| `/cadastro-cliente` | Formulário de cadastro de clientes |
| `/admin` | Painel administrativo completo |

## Integração n8n

O sistema inclui um **fluxo completo do n8n** para automação de notificações:

### 📧 Fluxo de Notificações Automáticas
- **Arquivo**: `Sistema Vendas - Notificações API.json`
- **Webhooks**: Recebe dados do sistema Flask
- **Filtros inteligentes**: Detecta apenas novos cadastros
- **Notificações por email**: Envia alertas automáticos via Gmail

### Como funciona:
1. Sistema Flask envia dados para webhooks n8n
2. N8n filtra apenas registros novos (evita duplicatas)
3. Envia email personalizado para cada novo cadastro
4. Mantém controle de estado para não reenviar

### Webhooks configurados:
- **Novo vendedor**: `http://localhost:5678/webhook/novo-vendedor`
- **Novo cliente**: `http://localhost:5678/webhook/novo-cliente`

## Estrutura Técnica

```
kalbir/
├── backend/           # API Flask + Banco de dados
├── frontend/          # Interface HTML/CSS/JS
├── Sistema Vendas - Notificações API.json  # Fluxo n8n
└── README.md
```

**Stack**: Flask + PostgreSQL + HTML/CSS/JS + n8n webhooks

## Configuração do N8N

### 1. Importar o fluxo
```bash
# No n8n, importar o arquivo:
Sistema Vendas - Notificações API.json
```

### 2. Configurar credenciais Gmail
- Adicionar conta Gmail nas credenciais do n8n
- Ajustar email de destino nos nós de envio

### 3. Ativar o workflow
- Ativar o fluxo no n8n
- Testar webhooks com cadastros no sistema