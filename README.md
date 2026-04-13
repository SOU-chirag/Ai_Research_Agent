# AI Research Agent

This repository contains a full-stack AI Research Agent built as a modern SaaS tool. It deeply researches user-provided topics through sequential logic mapping, generating sub-questions, aggregating bulk LLM queries securely via Langchain and Groq, and emitting native, fading real-time streams directly into a polished React UI.

## Project Structure
- `backend/`: FastAPI Python server handling WebSockets, LLM connection limits, and Groq `llama-3.3-70b-versatile` integrations.
- `frontend/`: Vite + React + Tailwind CSS client rendering real-time streaming UI using custom React hooks.

---

## 🛠 Required Prerequisites
To run this project locally, ensure you have the following installed:
1. **Python 3.10+**
2. **Node.js v18+** 
3. **Groq API Key**: You must have an active API Key from [Groq Console](https://console.groq.com/keys).

---

## 🚀 Setup Instructions

### 1. Backend Setup (FastAPI)
The backend orchestration uses Python to securely interact with the AI models.

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   - **Windows:** 
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Mac/Linux:** 
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up the Environment Variables:
   - In the `backend` folder, duplicate `.env.template` (or just create a `.env` file).
   - Enter your Groq API key:
     ```env
     GROQ_API_KEY="your_secret_groq_key_here"
     ```
5. Start the backend server:
   ```bash
   uvicorn main:app --port 8000 --reload
   ```
   *The backend will now strictly listen for WebSockets on `ws://127.0.0.1:8000/ws/research`.*

---

### 2. Frontend Setup (React/Vite)
The frontend encapsulates complex streaming into beautiful `tailwindcss`-styled components.

1. Open a **new, separate terminal window** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary JavaScript dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🧑‍💻 Using the Application

1. Open your web browser and navigate to the frontend URL (typically `http://localhost:5173`).
2. Type any advanced topic (e.g., *"The Impact of Quantum Computing on Cryptography"*) into the search UI.
3. Click **Start Research**.
4. The system will cleanly output its sequence mapping. Wait for the 150-word Executive Summary to drop, and click **Copy Report** to instantly copy everything to your clipboard!
