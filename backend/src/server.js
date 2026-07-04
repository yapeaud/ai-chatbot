import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

// Créer une instance de l'application Express
const app = express();
const port = process.env.PORT;

// Configurer les middlewares pour gérer les requêtes JSON et les problèmes de CORS
app.use(cors());
app.use(express.json());

// Créer une instance du client OpenAI avec la clé API
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// Définir une route GET pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Serveur en cours d\'exécution');
});

// Définir une route POST pour gérer les requêtes de chat
app.post('/chat', async (req, res) => {
    try {
        const reponse = await client.responses.create ({
            model: "gpt-4o-mini",
            input: req.body.message,
        });
        res.json({ message: reponse.output_text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Démarrer le serveur sur le port spécifié dans les variables d'environnement
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur le port ${port}`);
    console.log(`📍 URL: http://localhost:${port}`);
});

