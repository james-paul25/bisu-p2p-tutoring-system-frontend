import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Typography,
  Grid,
  Paper,
  Box, Card, CardContent
} from '@mui/material';
import { toast } from 'react-toastify';
import '../../assets/css/dashboard.css';

const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

function TutorDashboard() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [studentInfo, setStudentInfo] = useState(null);
  const [tutorSubjects, setTutorSubjects] = useState([]);
  const [tutorInfo, setTutorInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const tutorId = localStorage.getItem("tutorId");

  useEffect(() => {
    if (role !== 'TUTOR') {
      navigate("/login");
    }
  }, [role, navigate]);

  const fetchTutorSubjects = useCallback(async () => {
      try {
        const res = await fetch(`${baseUrl}/tutor-subjects/get-tutor-subjects/${tutorId}`);
        if (!res.ok) throw new Error('Failed to fetch tutor subjects');
        const data = await res.json();
        setTutorSubjects(data);
      } catch (error) {
        console.log(error);
      }
    }, [baseUrl, tutorId]);

    const fetchSubjects = useCallback(async () => {
      try {
        const response = await fetch(`${baseUrl}/subjects/get-all-subjects`);
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
       console.log(error);

      }
    },[baseUrl]);
    console.log("Subjects: ", subjects);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/users/get-student-info/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch student info");
        const data = await response.json();
        localStorage.setItem("studentId", data.studentId);
        setStudentInfo(data);
      } catch (error) {
        console.error("Error fetching student info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [userId, baseUrl]);
  console.log("Student Info: ", studentInfo);

  useEffect(() => {
    const fetchTutorInfo = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/tutors/get-tutor-by-user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch tutor info");
        const data = await response.json();
        localStorage.setItem("tutorId", data.tutorId);
        setTutorInfo(data);
      } catch (error) {
        console.error("Error fetching tutor info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorInfo();
  }, [userId, baseUrl]);

   useEffect(() => {
      fetchTutorSubjects();
      fetchSubjects();
    }, [fetchTutorSubjects, fetchSubjects]);

    console.log("Tutor Subjects: ", tutorSubjects);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.clear();
      toast.success('Successfully logged out!');
      navigate("/login");
      setLoading(false);
    }, 2000);
  };


  return (
    <Box
      sx={{
        width: '85vw',
        height: '100vh',
        backgroundColor: '#94B4C1',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        p: 2,
        overflowY: 'auto',
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Grid item xs={12} md={6} sx={{ mt: 4, width: '90%' }}>
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448' }}>
            <Typography variant="h4" gutterBottom color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
              Welcome, {username || 'Tutor'}!
            </Typography>
            <Typography variant="h6" gutterBottom color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={200}>
              Today is {getCurrentDate()}
            </Typography>
          </Paper>
        </Grid>
      <Paper
        elevation={8}
        sx={{
          width: '85%',
          marginTop: 2,
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
        

       
        <Typography variant="h5" mb={3} mt={5} color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>My Subjects</Typography>
        <Grid container spacing={2} mb={5}>
            
                {tutorSubjects.map((ts, index) => (
                 <Grid item xs={12} sm={6} md={4} key={index}>
                   <Card sx={{ background: '#213448', color: '#ECEFCA' ,fontFamily:'heavyweight', fontWeight:500}}>
                     <CardContent>
                        <Typography variant="subtitle1"><b>{ts.subject?.subjectName}</b></Typography>
                        <Typography variant="subtitle1"><b>{ts.subject?.subjectDescription}</b></Typography>
                        <Typography variant="body2">Grade: {ts.grade}</Typography>
                      </CardContent>
                  </Card>
                </Grid>
                ))}
            </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448',color: '#ECEFCA' ,fontFamily:'heavyweight', fontWeight:500 }}>
              <Typography variant="h6">Status</Typography>
              <Typography variant="h3">{tutorInfo?.status || 'N/A'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448', color: '#ECEFCA' ,fontFamily:'heavyweight', fontWeight:500 }}>
              <Typography variant="h6">Subjects</Typography>
              <Typography variant="h3">{subjects?.length || 0}</Typography>
            </Paper>
          </Grid>

          

          <Grid item xs={12}>
            <Typography variant="h6">Motivational Quote</Typography>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ fontStyle: 'italic' }}>
                "Teaching is the one profession that creates all other professions."
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} textAlign={'center'}>
            <Typography variant="h6">Quick Links</Typography>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {[
                { label: 'Profile', icon: '👤', link: '/tutor/tutor-profile' },
                { label: 'Sessions', icon: '📅', link: '/tutor/tutor-session' },
                { label: 'Logout', icon: '🚪', link: '#logout' },
              ].map((item, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={
                      item.link === '#logout'
                        ? handleLogout
                        : () => navigate(item.link)
                    }
                    disabled={loading && item.link === '#logout'}
                  >
                    {loading && item.link === '#logout' ? (
                      <CircularProgress size={20} />
                    ) : (
                      <>
                        {item.icon} {item.label}
                      </>
                    )}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default TutorDashboard;
