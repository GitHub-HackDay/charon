# Jira Service Desk Console

This project provides a web-based console to query and display Jira Service Desk tickets with AI-powered analysis and natural language processing capabilities.

## Features
- **AI-Powered Executive Summary**: OpenAI GPT-3.5-turbo integration for intelligent issue analysis
- **Natural Language Queries**: Ask questions like "Show me critical security issues" 
- **GitHub Copilot Optimization**: Issue descriptions optimized for better code suggestions
- **100+ Mock Issues**: Realistic dataset across security, memory, disk space, and network themes
- **Responsive UI**: Beautiful web interface with automatic ticket loading

## Structure
- `backend/`: Node.js/Express API server with OpenAI integration
- `frontend/`: React web UI with natural language query interface
- `mcp-server/`: Model Context Protocol server for AI analysis

## Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

### 2. Configure OpenAI API Key
Edit `backend/.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
```
Get your API key from: https://platform.openai.com/api-keys

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## API Endpoints
- `GET /rest/api/3/search` - Fetch tickets (Jira-compatible)
- `POST /api/query-nlp` - Natural language ticket filtering
- `POST /api/executive-summary` - AI-powered analysis with GitHub Copilot optimization

## Security Note
The `.env` file containing your OpenAI API key is excluded from version control. Never commit API keys to the repository.
