import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';

const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

function StudentDashboard() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const studentId = localStorage.getItem("studentId");

  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [totalTutors, setTotalTutors] = useState([]);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [loadingLinkIndex, setLoadingLinkIndex] = useState(null);

  const handleQuickLinkNavigation = (index, link) => {
    setLoadingLinkIndex(index);
    setTimeout(() => {
      setLoadingLinkIndex(null);
      navigate(link);
    }, 2000);
  };

  useEffect(() => {
    if (role !== 'STUDENT') {
      navigate("/login");
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const studentRes = await fetch(`${baseUrl}/users/get-student-info/${userId}`);
        if (!studentRes.ok) throw new Error("Failed to fetch student info");
        const studentData = await studentRes.json();
        localStorage.setItem("studentId", studentData.studentId);
        setStudentInfo(studentData);
      } catch (error) {
        console.error("Fetch error: ", error);
        toast.error("Failed to load dashboard info");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, baseUrl]);

  useEffect(() => {

    const fetchSessions = async () => {
      try {
        const res = await fetch(`${baseUrl}/sessions/get-session-by-student/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();
        
        setSessions(data.slice(0,2));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [baseUrl, studentId]);

  useEffect(() => {

    const fetchTutors = async () => {
      try {
        const res = await fetch(`${baseUrl}/tutors/get-all-tutors`);
        if (!res.ok) throw new Error("Failed to fetch tutors");
        const data = await res.json();
        
        setTotalTutors(data);
        console.log("total tutors", data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [baseUrl]);

  useEffect(() => {

    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${baseUrl}/subjects/get-all-subjects`);
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        
        setTotalSubjects(data);
        console.log("total subjects", data);
      } catch (err) {
        console.log(err);
        toast.error("Could not load your sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [baseUrl]);



  console.log("my sessions", sessions);
  console.log("my student info", studentInfo);


  return (
    <Box
      sx={{
        width: '85vw',
        height: '100vh',
        backgroundColor: '#94B4C1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        overflowY: 'auto',
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '95%',
          marginTop: 12,
          p: 5,
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
        <Grid item xs={12} md={6} sx={{ mt: 0, width: '95%', marginTop: 10 }}>
          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448', borderRadius: 5, boxShadow: 5 }}>
            <Typography variant="h4" gutterBottom color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
              Welcome, {username || 'Student'}!
            </Typography>
            <Typography variant="h6" gutterBottom color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
              Today is {getCurrentDate()}
            </Typography>
          </Paper>
        </Grid>

        {loading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448' }}>
                <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>Total Tutors</Typography>
                <Typography variant="h3" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{totalTutors?.length}</Typography>
                <Button onClick={() => navigate('student/student-tutor')} variant="outlined" sx={{ mt: 2 }}>
                  View Tutors
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448'}}>
                <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>Total Subjects</Typography>
                <Typography variant="h3" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{totalSubjects?.length}</Typography>
                <Button onClick={() => navigate('#')} variant="outlined" sx={{ mt: 2 }}>
                  View Subjects
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12}>
            <Box display="flex"  alignItems="center">
                <Typography variant="h6" color="#ECEFCA" fontFamily="heavyweight" fontWeight={700} mr={2}>
                  Upcoming Tutoring Sessions
                </Typography>
                <Button
                  onClick={() => navigate('/student/student-session')}
                  variant="outlined"
                  sx={{ mt: 0 }}
                >
                  See All
                </Button>
              </Box>
              {loading ? (
                <CircularProgress sx={{ mt: 4 }} />
              ) : sessions.length === 0 ? (
                <Typography color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>No sessions scheduled.</Typography>
              ) : (
                <Grid container spacing={4} sx={{ mt: 2 }}>
                  {sessions.map((session, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Paper sx={{ p: 3, textAlign: "center", backgroundColor: '#94B4C1', boxShadow: 3, borderRadius: 5 }}>
                        <img
                          src={'/das.jpg'}
                          alt="Tutor"
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: 10,
                          }}
                        />
                        <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
                          {session.subject?.subjectName || "Unknown Subject"}
                        </Typography>
                        <Typography color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
                          with {session.tutor?.student?.fullName || "Unknown Tutor"}
                        </Typography >
                        <Typography color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{session.sessionStatus}</Typography>
                        <Typography variant="body2" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
                          {new Date(session.createdAt).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Motivational Quote</Typography>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ fontStyle: 'italic' }}>
                  "Success is the sum of small efforts, repeated day in and day out."
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>Top Rated Tutors</Typography>
              <Grid container spacing={2}>
                {[
                  { name: 'Mr. Cruz', rating: 4.8, subject: 'Math', photo: '/das.jpg' },
                  { name: 'Ms. Reyes', rating: 4.7, subject: 'Science', photo: '/das.jpg' },
                  { name: 'Mr. Santos', rating: 4.9, subject: 'English', photo: '/das.jpg' },
                ].map((tutor, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#213448' }}>
                      <img
                        src={tutor.photo}
                        alt={tutor.name}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginBottom: 8,
                        }}
                      />
                      <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{tutor.name}</Typography>
                      <Typography color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{`${tutor.subject} - ${tutor.rating}⭐`}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            

          </Grid>
        )}

          <Grid item xs={12} sx={{marginTop: 5}}>
                <Typography variant="h6">Quick Links</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Tutors', icon: '👨‍🏫', link: '/student/student-tutor' },
                    { label: 'Messages', icon: '📩', link: '/student/student-messages' },
                    { label: 'Apply Tutor', icon: '📝', link: '/student/apply-tutor' },
                    { label: 'Profile', icon: '⚙️', link: '/student/student-profile' }
                  ].map((link, index) => (
                    <Grid item xs={6} sm={3} key={index} >
                      <Button
                        fullWidth
                        variant="outlined"
                        
                        onClick={() => handleQuickLinkNavigation(index, link.link)}
                        disabled={loadingLinkIndex === index}
                      >
                        {loadingLinkIndex === index ? (
                          <CircularProgress size={20} />
                        ) : (
                          <>
                            {link.icon} {link.label}
                          </>
                        )}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
      </Paper>
    </Box>
  );
}

export default StudentDashboard;
