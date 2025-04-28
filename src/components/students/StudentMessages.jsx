import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, Grid, Typography, IconButton, TextField, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const StudentMessages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const { sessionId } = useParams();
  const tutorId = localStorage.getItem("clickedTutortId");
  const studentId = localStorage.getItem("studentId");
  const currentUserRole = "STUDENT";

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${baseUrl}/messages/get-messages/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [baseUrl, sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }

    const messageData = {
      message: newMessage,
      senderRole: currentUserRole,
      sendAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${baseUrl}/messages/send/${sessionId}/${tutorId}/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to send message');
      toast.success("Message sent successfully");
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendFile = async () => {
  if (!selectedFile) {
    toast.error("Please select a file to send");
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('senderRole', currentUserRole);
  formData.append('sendAt', new Date().toISOString());

  try {
    const response = await fetch(`${baseUrl}/messages/send-file/${sessionId}/${tutorId}/${studentId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to send file');

    const result = await response.json();


    toast.success(result.message);
    

    setMessages(prev => [...prev, {
      fileName: selectedFile.name,
      senderRole: currentUserRole,
      sendAt: new Date().toISOString(),
      filePath: result.filePath
     
    }]);
    setSelectedFile(null);
  } catch (error) {
    console.error('Error sending file:', error);
    toast.error('Error sending file');
  }
};


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Box
      sx={{
        width: '85vw',
        height: '100vh',
        backgroundColor: '#94B4C1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        overflowY: 'auto',
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Grid item xs={12} md={10} sx={{ mt: 10, width: '95%', display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate('/student/student-messages')} sx={{ mr: 2 }}>
          <ArrowBackIcon sx={{ color: '#ECEFCA' }} />
        </IconButton>
        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448', borderRadius: 2, boxShadow: 5, flex: 1 }}>
          <Typography variant="h4" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
            Messages for Session {sessionId}
          </Typography>
        </Paper>
      </Grid>

     
        <Paper
          elevation={8}
          sx={{
            width: '80%',
            marginTop: 3,
            p: 1,
            borderRadius: 2,
            backgroundColor: '#ECEFCA',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              Chat History
            </Typography>

            {messages.map((msg) => {
              const isStudent = msg.senderRole === "STUDENT";
              return (
                <Box key={msg.messageId} display="flex" flexDirection="column" alignItems={isStudent ? "flex-end" : "flex-start"} mb={1}>
                    {!isStudent && (
                      <Typography variant="subtitle2" sx={{ alignSelf: 'flex-start', fontWeight: 'bold', mb: 0.5 }}>
                        {msg.session.tutor.student.firstName || 'Unknown Tutor'}
                      </Typography>
                    )}
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: isStudent ? '#213448' : '#94B4C1',
                      color: isStudent ? '#fff' : '#000',
                      borderRadius: 2,
                      maxWidth: '70%',
                      wordWrap: 'break-word',
                    }}
                  >
                    {msg.message && (
                      <Typography variant="body1">{msg.message}</Typography>
                    )}
                    {msg.filePath && (
                      <Box mt={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Attached File:
                        </Typography>
                        <a
                          href={msg.filePath}
                          download={msg.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                          {msg.fileName}
                        </a>
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.7rem',
                        mt: 1,
                        display: 'block',
                        textAlign: isStudent ? "right" : "left",
                      }}
                    >
                      {new Date(msg.sendAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            <div ref={messagesEndRef} />
          </Box>

          <Box display="flex" mt={2} alignItems="center">
            <IconButton component="label" sx={{ color: '#213448' }}>
              <AttachFileIcon />
              <input
                type="file"
                id='fileInput'
                accept="image/*, .pdf, .docx, .txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </IconButton>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ backgroundColor: '#fff', borderRadius: 2 }}
            />
            <Button
              variant="contained"
              sx={{ ml: 2, backgroundColor: '#213448', ':hover': { backgroundColor: '#1a2633' } }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2, backgroundColor: '#213448', ':hover': { backgroundColor: '#1a2633' } }}
              onClick={handleSendFile}
            >
              Send File
            </Button>
          </Box>

          {selectedFile && (
            <Box mt={2}>
              <Typography variant="body2">
                Selected File: {selectedFile.name}
              </Typography>
            </Box>
          )}
        </Paper>
      
    </Box>
  );
};

export default StudentMessages;
