# AI Chatbot

Application de chat avec IA composée d'un backend Express (API Groq) et d'un frontend React (Vite + Tailwind CSS).

## Structure du projet

```
ai-chatbot/
├── backend/    # API Express, communique avec Groq
└── frontend/   # Interface React (Vite + Tailwind)
```

## Prérequis

- Node.js 18+
- Une clé API Groq ([console.groq.com](https://console.groq.com))

## Backend

```bash
cd backend
npm install
cp .env.example .env   # renseigner PORT et GROQ_API_KEY
npm run dev             # ou: npm start
```

Le serveur démarre par défaut sur `http://localhost:3001` et expose :

- `GET /` — vérifie que le serveur fonctionne
- `POST /chat` — envoie `{ "message": "..." }` et reçoit `{ "message": "..." }`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

L'interface est servie par Vite (par défaut `http://localhost:5173`) et interroge le backend sur `http://localhost:3001`.

## Scripts utiles

| Commande (dans `backend/` ou `frontend/`) | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur en mode développement |
| `npm start` | Démarre le serveur (backend uniquement) |
| `npm run build` | Build de production (frontend uniquement) |
| `npm run lint` | Vérifie le code avec ESLint (frontend uniquement) |
