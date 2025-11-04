
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, User, Event } from '../types';
import { getAssistantResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatProps {
    currentUser: User;
    messages: ChatMessage[];
    onAddMessage: (message: ChatMessage) => void;
    events: Event[];
    users: User[];
}

const Chat: React.FC<ChatProps> = ({ currentUser, messages, onAddMessage, events, users }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
    const [apiKeyProblemType, setApiKeyProblemType] = useState<'missing_env' | 'not_selected' | 'invalid' | null>(null);
    const [lastAssistantQuery, setLastAssistantQuery] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showApiKeyPrompt]); // Scroll to bottom when messages or prompt changes

    const handleSendMessage = useCallback(async (messageToSend: string, isRetry: boolean = false) => {
        if (messageToSend.trim() === '') return;

        const userMessageText = messageToSend;

        // Only add user message to chat history if it's not a retry (to avoid duplicate display)
        if (!isRetry) {
            const userMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                userId: currentUser.id,
                text: userMessageText,
                timestamp: Date.now(),
            };
            onAddMessage(userMessage);
        }
        
        const assistantQuery = userMessageText.trim().startsWith('@assistant') ? userMessageText.trim().substring(10).trim() : null;

        if (assistantQuery) {
            setIsThinking(true);
            // Store the query for potential retry if API key selection is needed
            setLastAssistantQuery(assistantQuery);

            try {
                // Attempt to get a response from the assistant
                const assistantResponseText = await getAssistantResponse(assistantQuery, currentUser.name, events, users);
                
                // If successful, add assistant message and clear any API key related prompts/errors
                const assistantMessage: ChatMessage = {
                     id: `msg-${Date.now() + 1}`,
                     userId: 'assistant-1',
                     text: assistantResponseText,
                     timestamp: Date.now(),
                };
                onAddMessage(assistantMessage);
                setShowApiKeyPrompt(false);
                setApiKeyProblemType(null);
                setLastAssistantQuery(null); // Clear last query after successful response

            } catch (error: any) {
                console.error("Assistant API error:", error);
                // Handle different API key related errors
                if (error.message === "API_KEY_MISSING_ENV") {
                    setApiKeyProblemType('missing_env');
                    setShowApiKeyPrompt(true);
                } else if (error.message === "API_KEY_NOT_SELECTED") {
                    setApiKeyProblemType('not_selected');
                    setShowApiKeyPrompt(true);
                } else if (error.message === "API_KEY_INVALID") {
                    setApiKeyProblemType('invalid');
                    setShowApiKeyPrompt(true);
                } else {
                    // For any other generic API errors, show a default message
                    const assistantMessage: ChatMessage = {
                        id: `msg-${Date.now() + 1}`,
                        userId: 'assistant-1',
                        text: t('apiGenericError'),
                        timestamp: Date.now(),
                    };
                    onAddMessage(assistantMessage);
                    setShowApiKeyPrompt(false); // No specific prompt for generic errors
                    setApiKeyProblemType(null);
                }
            } finally {
                setIsThinking(false);
            }
        }
        
        setNewMessage(''); // Clear the input field after sending
    }, [currentUser, onAddMessage, events, users, t]);

    const handleSelectApiKey = useCallback(async () => {
        // Only proceed if window.aistudio is available in the environment
        if (typeof window !== 'undefined' && typeof window.aistudio !== 'undefined') {
            await window.aistudio.openSelectKey();
            // After the user interacts with the selection dialog, attempt to re-send the last query
            if (lastAssistantQuery) {
                // Send the query as a retry, so it doesn't add a duplicate user message
                await handleSendMessage(`@assistant ${lastAssistantQuery}`, true);
            } else {
                // If no last query, just clear the prompt and let the user type again
                setShowApiKeyPrompt(false);
                setApiKeyProblemType(null);
            }
        }
    }, [lastAssistantQuery, handleSendMessage]);

    const getUserById = (id: string) => users.find(u => u.id === id);

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-4xl font-black tracking-tight mb-4">{t('teamChat')}</h1>
            <div className="flex-1 bg-gray-800 rounded-xl shadow-lg flex flex-col p-4 overflow-hidden">
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 rtl:pr-0 rtl:pl-2">
                    {messages.map(message => {
                        const user = getUserById(message.userId);
                        const isCurrentUser = message.userId === currentUser.id;
                        return (
                            <div
                                key={message.id}
                                className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isCurrentUser && (
                                    <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                                )}
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl ${isCurrentUser ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                                    {!isCurrentUser && (
                                      <p className="font-bold text-sm mb-1 text-emerald-300 text-left rtl:text-right">{user?.name}</p>
                                    )}
                                    <p className="text-white whitespace-pre-wrap text-left rtl:text-right">{message.text}</p>
                                    <p className="text-xs text-gray-400 mt-2 text-right rtl:text-left">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                {isCurrentUser && (
                                    <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                                )}
                            </div>
                        );
                    })}
                     {isThinking && (
                        <div className="flex items-start gap-3 justify-start">
                            <img src={users.find(u => u.id === 'assistant-1')?.avatar} alt="Assistant" className="w-10 h-10 rounded-full" />
                            <div className="bg-gray-700 p-3 rounded-xl">
                                <p className="font-bold text-sm mb-1 text-emerald-300">{t('assistantThinking')}</p>
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    {showApiKeyPrompt && (
                        <div className="bg-orange-500/20 border border-orange-500 text-orange-300 p-4 rounded-xl mt-4 text-center">
                            {apiKeyProblemType === 'missing_env' && (
                                <p>{t('apiKeyMissingEnv')}</p>
                            )}
                            {apiKeyProblemType === 'not_selected' && (
                                <>
                                    <p>{t('apiKeyNotSelected')}</p>
                                    {/* Only show button if window.aistudio is available */}
                                    {typeof window !== 'undefined' && typeof window.aistudio !== 'undefined' && (
                                        <button
                                            onClick={handleSelectApiKey}
                                            className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                                        >
                                            {t('selectApiKey')}
                                        </button>
                                    )}
                                </>
                            )}
                            {apiKeyProblemType === 'invalid' && (
                                <>
                                    <p>{t('apiKeyInvalid')}</p>
                                    <p className="text-sm mt-1">{t('apiKeyInvalidDetails')}</p>
                                    {/* Only show button if window.aistudio is available */}
                                    {typeof window !== 'undefined' && typeof window.aistudio !== 'undefined' && (
                                        <button
                                            onClick={handleSelectApiKey}
                                            className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                                        >
                                            {t('reselectApiKey')}
                                        </button>
                                    )}
                                    <p className="text-xs mt-2">
                                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                                            {t('billingDocs')}
                                        </a>
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(newMessage); }} className="mt-4 flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('typeYourMessage')}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                        {t('send')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
