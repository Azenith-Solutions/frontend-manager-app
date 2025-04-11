import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "./AssistenteIa.module.css";

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWNrZW5kLWFwaS1yZXN0Iiwic3ViIjoiZ2VtaW5pQGdvb2dsZS5jb20iLCJleHAiOjE3NDQzODgwNjB9.V6BDq-RoVYAg_7Qht5G9yFsKJ5eDmjBDPcxpLtOtBWA';

const AssistenteIa = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = handleSpeechEnd;
    } else {
      console.error('Speech recognition not supported in this browser');
    }

    // Load chat history on component mount
    loadHistory();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSpeechResult = (event) => {
    let finalTranscript = '';
    let currentInterimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
        // Automatically send final transcript to API
        sendMessage(transcript.trim());
      } else {
        currentInterimTranscript += transcript;
      }
    }

    setInterimTranscript(currentInterimTranscript);
  };

  const handleSpeechError = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  const handleSpeechEnd = () => {
    setIsListening(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Make sure we're using the same recognition instance
      // and not creating a new one which would lose context
      try {
        // Before starting, ensure we've loaded the latest chat history
        loadHistory();
        recognitionRef.current.start();
        setInterimTranscript('');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        
        // If there's an error (like recognition is already started),
        // reinitialize the recognition object
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'pt-BR';
          
          recognitionRef.current.onresult = handleSpeechResult;
          recognitionRef.current.onerror = handleSpeechError;
          recognitionRef.current.onend = handleSpeechEnd;
          
          // Try again
          recognitionRef.current.start();
          setInterimTranscript('');
        }
      }
    }
    setIsListening(!isListening);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message to chat history
    const updatedHistory = [
      ...chatHistory,
      { role: 'user', content: text }
    ];
    
    // Update chat history immediately
    setChatHistory(updatedHistory);
    // Save to session storage after each user message
    saveHistory(updatedHistory);
    
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/ai/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_TOKEN}`
        },
        body: JSON.stringify({
          message: text,
          history: updatedHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.response || JSON.stringify(data);
      const cleanedResponse = aiResponse.replace(/^Assistant:\s*/i, '');

      // Add AI response to chat history
      const finalHistory = [
        ...updatedHistory,
        { role: 'assistant', content: cleanedResponse }
      ];
      
      setChatHistory(finalHistory);
      saveHistory(finalHistory);
    } catch (error) {
      console.error('Error communicating with backend:', error);
      
      // Add error message to chat history
      const errorHistory = [
        ...updatedHistory,
        { role: 'error', content: `Error: ${error.message}` }
      ];
      setChatHistory(errorHistory);
      saveHistory(errorHistory);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = (history) => {
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
  };

  const loadHistory = () => {
    const savedHistory = sessionStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
    sessionStorage.removeItem('chatHistory');
  };

  const renderMessage = (msg, index) => {
    switch(msg.role) {
      case "user":
        return (
          <Box key={index} className={styles.userMessage}>
            <Typography variant="body1"><strong>Você:</strong> {msg.content}</Typography>
          </Box>
        );
      case "assistant":
        return (
          <Box key={index} className={styles.aiMessage}>
            <Typography variant="body1"><strong>IA:</strong> {msg.content}</Typography>
          </Box>
        );
      case "error":
        return (
          <Box key={index} className={styles.errorMessage}>
            <Typography variant="body1">{msg.content}</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.chatContainer}>
        <Box className={styles.controls}>
          <IconButton 
            onClick={toggleListening}
            className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
          >
            {isListening ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
          <Box className={`${styles.statusIndicator} ${isListening ? styles.active : ''}`}>
            {isListening ? 'Reconhecendo fala...' : 'Reconhecimento parado'}
          </Box>
        </Box>
        
        {interimTranscript && (
          <Box className={styles.interimTranscript}>
            <Typography variant="body2" fontStyle="italic">
              Ouvindo: {interimTranscript}
            </Typography>
          </Box>
        )}
        
        <Box className={styles.chatHistoryHeader}>
          <Button 
            startIcon={<ChatIcon />} 
            onClick={clearHistory}
            variant="outlined"
            color="success"
            size="small"
          >
            Novo Chat
          </Button>
        </Box>
        
        <Divider/>
        
        <Box ref={chatContainerRef} className={styles.transcription}>
          {chatHistory.map((msg, index) => renderMessage(msg, index))}
          
          {loading && (
            <Box className={styles.loadingIndicator}>
              <CircularProgress size={20} sx={{ marginRight: 1, color: "#61131A" }} />
              <Typography variant="body2">Aguardando resposta da IA...</Typography>
            </Box>
          )}
        </Box>
        
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          className={styles.messageForm}
        >
          <TextField
            fullWidth
            multiline
            rows={1}
            variant="outlined"
            placeholder="Digite sua mensagem aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            sx={{
                "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                    borderColor: "#9C1F2E", // cor ao passar o mouse
                    },
                  "&.Mui-focused": {
                    "& fieldset": {
                      borderColor: "#61131A",
                    },
                  },
                },
              }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={!message.trim() || loading}
            sx={{ 
              backgroundColor: "#61131A",
              "&:hover": {
                backgroundColor: "#8B1E26"
              },
              height: "56px", // Match the default height of the multiline TextField
              padding: "0 16px", // Add appropriate horizontal padding
              alignSelf: "stretch", // Stretch to match parent height
              display: "flex",
              alignItems: "center"
            }}
          >
            Enviar
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export { AssistenteIa };