import React, {useState, useEffect, useCallback} from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Button, CircularProgress,  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {Table, TableBody, TableContainer, TableHead, TableCell, TableRow} from '@mui/material';


const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const AdminDashboard = () => {

    const [loadingLinkIndex, setLoadingLinkIndex] = useState(null);
    const [admin, setAdmin] = useState({});
    const [tutors, setTutors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const adminId = localStorage.getItem("adminId");

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    

    useEffect(() => {
      const fetchAdmin = async () => {
        try {
          const res = await fetch(`${baseUrl}/admin/get-admin/${adminId}`);

          const adminData = await res.json();
          setAdmin(adminData);
          console.log(adminData);
        } catch (error) {
          console.log('Error loading profile: ' + error.message);
        }
      };

       const fetchSubjects = async () => {
            try {
              const res = await fetch(`${baseUrl}/subjects/get-all-subjects`);
              if (!res.ok) throw new Error("Failed to fetch subjects");
              const data = await res.json();
              
              setSubjects(data);
              console.log("total subjects", data);
            } catch (err) {
              console.log(err);
              toast.error("Could not load your sessions");
            }
          };

      const fetchTutors = async () => {
            try {
              const res = await fetch(`${baseUrl}/tutors/get-all-tutors`);
              if (!res.ok) throw new Error("Failed to fetch tutors");
              const data = await res.json();
              setTutors(data);
              console.log("total tutors", data);
            } catch (err) {
              console.error(err);
              toast.error("Could not load your sessions");
            }
          };

        const fetchUsers = async () => {
          try {
            const res = await fetch(`${baseUrl}/users/get-all-users`);
            if (!res.ok) throw new Error("Failed to fetch tutors");
            const data = await res.json();
            setUsers(data);
            

          } catch (err) {
            console.error(err);
            toast.error("Could not load your sessions");
          }
        };   

        const fetchStudents = async () => {
          try {
            const res = await fetch(`${baseUrl}/users/get-all-users`);
            if (!res.ok) throw new Error("Failed to fetch tutors");
            const data = await res.json();

            const students = data.filter(user => user.role === 'STUDENT');
            setStudents(students);
            
          } catch (err) {
            console.error(err);
            toast.error("Could not load your sessions");
          }
        }; 
      
      fetchUsers();
      fetchStudents();
      fetchTutors();
      fetchSubjects();
      fetchAdmin();
    }, [baseUrl, adminId]);

    console.log(admin);
    console.log("total students", students);
    console.log("total users", users);
    

    const fetchLeaderboard = useCallback(async () => {
      try {
        
        const ratingsRes = await fetch(`${baseUrl}/rates/average`);
        if (!ratingsRes.ok) throw new Error("Failed to fetch ratings");
    
        const ratingsData = await ratingsRes.json(); 
        console.log("Ratings Data: ", ratingsData);
  
        const tutorsRes = await fetch(`${baseUrl}/tutors/get-all-tutors`);
        if (!tutorsRes.ok) throw new Error("Failed to fetch tutors");
    
        const tutorsData = await tutorsRes.json(); 
    
        const merged = ratingsData
          .map((rate) => {
            const tutor = tutorsData.find((t) => t.tutorId === rate.tutorId);
            return tutor
              ? {
                  tutorId: rate.tutorId,
                  rating: rate.averageRating,
                  fullName: tutor.student?.fullName || "N/A",
                }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
    
        setLeaderboard(merged);
      } catch (error) {
        console.error(error);
        toast.error("Could not load leaderboard");
      }
    }, [baseUrl]);
    

  useEffect(() => {
      fetchLeaderboard();
    }, [fetchLeaderboard]);

    console.log("Leaderboard: ", leaderboard);
    


    const handleQuickLinkNavigation = (index, link) => {
      setLoadingLinkIndex(index);
      setTimeout(() => {
        setLoadingLinkIndex(null);
        navigate(link);
      }, 2000);
    };


    return(
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

            <Grid item xs={12} md={10} sx={{ mt: 4, width: '90%', mb: 2 }}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448',  borderRadius: 5, boxShadow: 5 }}>
                  <Typography variant="h4" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                        Admin Dashboard
                  </Typography>
                    
                 </Paper>
            </Grid>

        <Paper
              elevation={8}
              sx={{
                width: '80%',
                marginTop: 1,
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

              <Grid item xs={12} md={6} sx={{ mt: 0, width: '95%', marginTop: 2 }}>
                        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448', borderRadius: 5, boxShadow: 5 }}>
                          <Typography variant="h4" gutterBottom color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
                            Welcome, {username || 'Admin'}!
                          </Typography>
                          <Typography variant="h6" gutterBottom color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
                            Today is {getCurrentDate()}
                          </Typography>
                        </Paper>
                      </Grid>

              <Grid container spacing={4} sx={{ mt: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448', borderRadius: 5, boxShadow: 5 }}>
                      <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>Total Subjects</Typography>
                      <Typography variant="h3" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{subjects?.length}</Typography>
                      <Button onClick={() => navigate('/admin/admin-subject')} variant="outlined" sx={{ mt: 2 }}>
                        View Subjects
                      </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448', borderRadius: 5, boxShadow: 5 }}>
                      <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>Total Tutors</Typography>
                      <Typography variant="h3" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{tutors?.length}</Typography>
                      <Button onClick={() => navigate('/admin/admin-tutor-request')} variant="outlined" sx={{ mt: 2 }}>
                        View Tutors
                      </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448', borderRadius: 5, boxShadow: 5 }}>
                      <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>Total Students</Typography>
                      <Typography variant="h3" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{students?.length}</Typography>
                      <Button onClick={() => navigate('/admin/admin-tutor-request')} variant="outlined" sx={{ mt: 2 }}>
                        View Users
                      </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#213448', borderRadius: 5, boxShadow: 5 }}>
                      <Typography variant="h6" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>Total Users</Typography>
                      <Typography variant="h3" color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>{users?.length}</Typography>
                      <Button onClick={() => navigate('/admin/admin-tutor-request')} variant="outlined" sx={{ mt: 2 }}>
                        View Users
                      </Button>
                    </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={4} sx={{ mt: 4 }}>
                <Grid item xs={12} md={10} sx={{ mt: 4, width: '95%'}}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448',  borderRadius: 5, boxShadow: 5 }}>
                    <Typography variant="h4" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                        Leaderboard
                    </Typography>
                    <Typography variant="body1" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                        This is the leaderboard for the tutors.
                    </Typography>
                    </Paper>
                </Grid>

                <TableContainer component={Paper} sx={{ 
                      mt: 2, 
                      width: '80%', 
                      mx: 'auto',
                      borderRadius: 2, 
                      backgroundColor: '#94B4C1',
                      boxShadow: 5,
                      display: 'flex', 
                      justifyContent: 'center'
                    }}>
                    <Grid item xs={12} md={10} sx={{ mt: 0, width: '95%' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="sessions table">
                    <TableHead> 
                      <TableRow>
                        <TableCell><b>Rank</b></TableCell>
                        <TableCell><b>Name</b></TableCell>
                        <TableCell><b>Rate</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {leaderboard.map((tutor, index) => (
                        <TableRow key={tutor.tutorId}>
                          <TableCell>#{index + 1}</TableCell>
                          <TableCell>{tutor.fullName || "N/A"}</TableCell>
                          <TableCell>{tutor.rating?.toFixed(1) ?? "N/A"} ⭐</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                    </Grid>
                </TableContainer>

              </Grid>


            <Grid item xs={12} sx={{marginTop: 5}}>
                <Typography variant="h6">Quick Links</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Subjects', icon: '📚', link: '/admin/admin-subject' },
                    { label: 'Sessions', icon: '🧑‍💻', link: '/admin/admin-session' },
                    { label: 'Requests', icon: '📝', link: '/student/admin-tutor-request' },
                    { label: 'Users', icon: '👥', link: '/admin/admin-users' }
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

export default AdminDashboard;