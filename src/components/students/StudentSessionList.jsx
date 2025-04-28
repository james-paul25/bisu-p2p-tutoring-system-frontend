import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Typography, Button, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const StudentSessionList = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const studentId = localStorage.getItem('studentId');

  

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${baseUrl}/sessions/get-session-by-student/${studentId}`);
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSessions();
  }, [baseUrl, studentId]);

  const handleSessionClick = (sessionId, tutorId) => {
    navigate(`/student/student-messages/${sessionId}`);
    localStorage.setItem("clickedTutortId", tutorId);
  };

  const formatTo12Hour = (time) => {
    const [hours, minutes, seconds] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
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
      <Grid  sx={{ mt: 3, width: '90%' }}>
        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448', borderRadius: 2, boxShadow: 5, flex: 1 }}>
          <Typography variant="h4" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
            Messages
          </Typography>
        </Paper>
      </Grid>

      <Paper
          elevation={8}
          sx={{
            width: '80%',
            marginTop: 2,
            p: 4,
            borderRadius: 2,
            backgroundColor: '#94B4C1',
            color: '#000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
        {sessions.map((session) => (
          <Box
            key={session.sessionId}
            sx={{
              width: '90%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {session.subject.subjectDescription} - {session.tutor.student.fullName} - 
              {formatDate(session.sessionDate)} {formatTo12Hour(session.sessionTime)}
            </Typography>
            <IconButton onClick={() => handleSessionClick(session.sessionId, session.tutor.tutorId)}>
              <ArrowForwardIcon sx={{ color: '#213448' }} />
            </IconButton>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default StudentSessionList;
