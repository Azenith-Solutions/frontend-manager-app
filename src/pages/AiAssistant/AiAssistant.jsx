import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    TextField,
    IconButton,
    Avatar,
    Chip,
    Paper,
    CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PersonIcon from "@mui/icons-material/Person";
import Markdown from "react-markdown";
import { apiAi } from "../../service/api";
import "./AiAssistant.css";

const SUGGESTIONS = [
    "Quantos componentes temos no estoque?",
    "Quais itens estao com estoque baixo?",
    "Quais categorias de componentes existem?",
    "Quais pedidos estao pendentes?",
    "Quais sao os componentes mais vendidos?",
    "Como cadastrar um novo componente?",
];

const AiAssistant = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const buildHistory = () => {
        return messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));
    };

    const sendMessage = async (messageText) => {
        const text = messageText || input.trim();
        if (!text || isLoading) return;

        const userMessage = { role: "user", content: text };
        const history = buildHistory();

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await apiAi.post("/ai/assistant/chat", {
                message: text,
                history: history,
            });

            const data = response.data?.data;
            const assistantMessage = {
                role: "assistant",
                content: data?.response || "Desculpe, nao consegui processar sua solicitacao.",
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage = {
                role: "assistant",
                content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        sendMessage(suggestion);
    };

    const handleClearChat = () => {
        setMessages([]);
        setInput("");
    };

    return (
        <Box className="ai-assistant-container">
            {messages.length === 0 ? (
                <Box className="welcome-container">
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "#61131A",
                        }}
                    >
                        <PsychologyIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <h2>Assistente IA - Hardware Tech</h2>
                    <p>
                        Sou seu assistente inteligente para gerenciamento de estoque.
                        Posso consultar dados do sistema, responder perguntas sobre
                        componentes eletronicos e ajudar com informacoes tecnicas.
                    </p>
                    <Box className="suggestions-container">
                        {SUGGESTIONS.map((suggestion, index) => (
                            <Chip
                                key={index}
                                label={suggestion}
                                variant="outlined"
                                onClick={() => handleSuggestionClick(suggestion)}
                                sx={{
                                    borderColor: "#61131A",
                                    color: "#61131A",
                                    cursor: "pointer",
                                    "&:hover": {
                                        backgroundColor: "#61131A",
                                        color: "#FFFFFF",
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            ) : (
                <Box className="chat-messages">
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            className={`message-row ${msg.role}`}
                        >
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor:
                                        msg.role === "user"
                                            ? "#61131A"
                                            : "#f5f5f5",
                                    color:
                                        msg.role === "user"
                                            ? "#FFFFFF"
                                            : "#61131A",
                                    flexShrink: 0,
                                }}
                            >
                                {msg.role === "user" ? (
                                    <PersonIcon sx={{ fontSize: 18 }} />
                                ) : (
                                    <PsychologyIcon sx={{ fontSize: 18 }} />
                                )}
                            </Avatar>
                            <Paper
                                elevation={0}
                                className={`message-bubble ${msg.role}`}
                            >
                                {msg.role === "assistant" ? (
                                    <Box className="markdown-content">
                                        <Markdown>{msg.content}</Markdown>
                                    </Box>
                                ) : (
                                    msg.content
                                )}
                            </Paper>
                        </Box>
                    ))}

                    {isLoading && (
                        <Box className="message-row assistant">
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: "#f5f5f5",
                                    color: "#61131A",
                                    flexShrink: 0,
                                }}
                            >
                                <PsychologyIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Paper
                                elevation={0}
                                className="message-bubble assistant"
                            >
                                <Box className="typing-indicator">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </Box>
                            </Paper>
                        </Box>
                    )}

                    <div ref={messagesEndRef} />
                </Box>
            )}

            <Box className="chat-input-area">
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                    {messages.length > 0 && (
                        <IconButton
                            onClick={handleClearChat}
                            disabled={isLoading}
                            title="Limpar conversa"
                            sx={{
                                color: "#61131A",
                                width: 40,
                                height: 40,
                                "&:hover": {
                                    bgcolor: "rgba(97, 19, 26, 0.08)",
                                },
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    )}
                    <TextField
                        inputRef={inputRef}
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Digite sua pergunta..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        variant="outlined"
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "24px",
                                "&.Mui-focused fieldset": {
                                    borderColor: "#61131A",
                                },
                            },
                        }}
                    />
                    <IconButton
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        sx={{
                            bgcolor: "#61131A",
                            color: "#FFFFFF",
                            width: 40,
                            height: 40,
                            "&:hover": {
                                bgcolor: "#8B1E26",
                            },
                            "&.Mui-disabled": {
                                bgcolor: "rgba(97, 19, 26, 0.3)",
                                color: "#FFFFFF",
                            },
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={20} sx={{ color: "#FFFFFF" }} />
                        ) : (
                            <SendIcon sx={{ fontSize: 20 }} />
                        )}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default AiAssistant;
