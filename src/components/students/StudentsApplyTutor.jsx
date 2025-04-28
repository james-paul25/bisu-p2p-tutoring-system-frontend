import React, { useState } from 'react';
import { Box, Button, Typography, Modal, TextField, Paper, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StudentsApplyTutor = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState('');

  const userID = localStorage.getItem("userId");
  const studentID = localStorage.getItem("studentId");

  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleApply = async() => {
    if (!grade) {
      toast.error("Please enter your grade.");
      setGrade("");
      return;
    }

    if (!studentID) {
          toast.error("Student ID is missing.");
          return;
    }
        setLoading(true);

        setTimeout(async () => {
          try {
            const response = await fetch(`${baseUrl}/tutors/apply/${userID}/${studentID}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({gwa : parseFloat(grade)}),
            });

            if (response.ok) {
              toast.success("You have successfully applied to become a tutor!");
              setGrade("");
              setOpen(false);
              setTimeout(2000);
              navigate("/tutor-dashboard");
            } else {
              const errorData = await response.text();
              toast.error("Failed to apply for tutor." + errorData);
              setGrade("");
            }
          } catch (error) {
            console.error("Apply error:", error);
            toast.error("An error occurred. Please try again.");
            setGrade("");
          } finally {
            setLoading(false);
          }
        }, 2000);
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

<Grid item xs={12} md={10} sx={{ mt: 4, width: '90%', mb: 10 }}>
                                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448',  borderRadius: 5, boxShadow: 5 }}>
                                <Typography variant="h4" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                                    APPLY NOW!
                                </Typography>
                                
                                </Paper>
                            </Grid>

          <Paper
            elevation={8}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              borderRadius: '20px',
              background: '#94B4C1',
              color: '#000',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#000' }}>
          Become a Tutor
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          Help other students excel by becoming a tutor. Share your knowledge, gain experience,
          and earn rewards. To get started, just tell us your current grade!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            mt: 2,
            backgroundColor: '#524fe8',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#403ddc',
            },
          }}
        >
          Apply as Tutor
        </Button>
      </Paper>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#fff',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Enter Your GWA
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="e.g. 1.5"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            sx={{
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#fff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#524fe8',
                },
              },
              mb: 2,
            }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={loading}
            fullWidth
            sx={{
              backgroundColor: '#524fe8',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#403ddc',
              },
            }}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default StudentsApplyTutor;
