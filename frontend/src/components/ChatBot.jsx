import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Send, Settings, Trash2, X } from 'lucide-react';

// Base URL pour l'API backend
const API_BASE_URL = 'http://localhost:3001';

const formatTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatBot = () => {
    const [message, setMessage] = useState(''); // State pour le message de l'utilisateur
    const [messages, setMessages] = useState([]); // State pour stocker les messages échangés avec le bot
    const [isSending, setIsSending] = useState(false); // State pour l'indicateur de chargement
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State pour l'ouverture du panneau de paramètres
    const [systemPrompt, setSystemPrompt] = useState(''); // Instructions système envoyées avec chaque requête
    const [draftSystemPrompt, setDraftSystemPrompt] = useState(''); // Brouillon édité dans le panneau de paramètres

    const messagesEndRef = useRef(null);

    // Défiler automatiquement vers le dernier message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fonction pour envoyer le message de l'utilisateur au backend
    const sendMessage = async () => {
        const trimmed = message.trim();
        if (!trimmed || isSending) return;

        const userMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed, time: formatTime() };
        setMessages((prev) => [...prev, userMessage]);
        setMessage('');
        setIsSending(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/chat`, {
                message: trimmed,
                systemPrompt: systemPrompt || undefined,
            });
            const botMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: res.data.message,
                time: formatTime(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: 'assistant', content: 'Désolé, une erreur est survenue.', time: formatTime() },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    // Fonction pour gérer l'appui sur la touche "Entrée" dans le champ de saisie
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    // Fonction pour supprimer tous les messages
    const clearMessages = () => setMessages([]);

    // Fonction pour ouvrir le panneau de paramètres
    const openSettings = () => {
        setDraftSystemPrompt(systemPrompt);
        setIsSettingsOpen(true);
    };

    // Fonction pour sauvegarder les paramètres
    const saveSettings = () => {
        setSystemPrompt(draftSystemPrompt);
        setIsSettingsOpen(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md h-[700px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative">

                <div className="flex items-center justify-between p-5 border-b">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-gray-800">AI Assistant</h2>
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <p className="text-xs text-gray-500">{isSending ? 'Réponse en cours...' : 'Online'}</p>
                    </div>

                    <div className="flex gap-3 text-gray-500">
                        <button
                            type="button"
                            onClick={clearMessages}
                            className="flex items-center justify-center rounded-full p-2 hover:text-red-500"
                            aria-label="Effacer la conversation"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={openSettings}
                            className="flex items-center justify-center rounded-full p-2 hover:text-blue-500"
                            aria-label="Paramètres"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 bg-white">
                    {messages.map((msg) => {
                        const isUser = msg.role === 'user'
                        return (
                            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                {!isUser && (
                                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-2">
                                        AI
                                    </div>
                                )}

                                <div className="max-w-[75%]">
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${isUser
                                            ? 'bg-blue-500 text-white rounded-br-md'
                                            : 'bg-gray-100 text-gray-700 rounded-bl-md'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                    </div>
                                    <p className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4 bg-white">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                        <input
                            type="text"
                            aria-label="Message"
                            placeholder="Posez une question..."
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none text-sm"
                            disabled={isSending}
                        />
                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={isSending || !message.trim()}
                            className="ml-2 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Envoyer"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {isSettingsOpen && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 z-10">
                        <div className="w-full bg-white rounded-2xl shadow-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-800">Paramètres</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                    aria-label="Fermer les paramètres"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="system-prompt">
                                Message système (instructions envoyées à l'IA avant chaque conversation)
                            </label>
                            <textarea
                                id="system-prompt"
                                value={draftSystemPrompt}
                                onChange={(event) => setDraftSystemPrompt(event.target.value)}
                                placeholder="Ex : Réponds toujours de façon concise et en français."
                                className="w-full h-28 text-sm border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="px-4 py-2 text-sm rounded-full text-gray-600 hover:bg-gray-100"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={saveSettings}
                                    className="px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;
