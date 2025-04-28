import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Modal, TextField, MenuItem, Avatar, CircularProgress, Paper,
  Grid
} from '@mui/material';
import { toast } from 'react-toastify';

const StudentProfile = () => {
  const [student, setStudent] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  

  const userId = localStorage.getItem('userId');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/departments/getAllDepartment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch departments');

      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      toast.error('Error loading departments: ' + error.message);
    }
  }, [baseUrl]);

  
  

  const fetchStudentProfile = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/users/get-student-info/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch student profile');

      const studentData = await res.json();
      setStudent(studentData);

    } catch (error) {
      toast.error('Error loading profile: ' + error.message);
    }
  }, [baseUrl, userId]);

  

  useEffect(() => {
    fetchDepartments();
    fetchStudentProfile();
  }, [fetchDepartments, fetchStudentProfile]);

  useEffect(() => {
    if (departments.length > 0 && student.departmentId) {
      const studentDept = departments.find(dep => dep.departmentId === student.departmentId);
      if (studentDept) {
        localStorage.setItem("departmentName", studentDept.departmentName);
      }
    }
  }, [departments, student.departmentId]);

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await fetch(`${baseUrl}/students/update-student/${userId}`, {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student),
        });
  
        if (!res.ok) throw new Error(await res.text());
  
        toast.success("Profile updated");
  
        await fetchStudentProfile();
        setOpen(false);
       
      } catch (error) {
        toast.error("Update failed: " + error.message);
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

            <Grid item xs={12} md={10} sx={{ mt: 4, width: '90%', mb: 2 }}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448',  borderRadius: 5, boxShadow: 5 }}>
                <Typography variant="h4" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                    Profile
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
          color: '#FFFFFF',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar
          src={'dasfa.jpg'}
          sx={{
            width: 100, 
            height: 100,
            mb: 2,
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
          }}
        />
        <Typography sx={{ color: '#524fe8', textAlign: 'center', width: '100%' }}>
          <b>First Name:</b> {student.firstName}
        </Typography>
        <Typography sx={{ color: '#524fe8', textAlign: 'center', width: '100%' }}>
          <b>Middle Name: </b>{student.middleName}
        </Typography>
        <Typography sx={{ color: '#524fe8', textAlign: 'center', width: '100%' }}>
          <b>Last Name: </b> {student.lastName}
        </Typography>
        <Typography sx={{ color: '#524fe8', textAlign: 'center', width: '100%' }}>
          <b>Year Level: </b> {student.yearLevel}
        </Typography>
        <Typography sx={{ color: '#524fe8', textAlign: 'center', width: '100%' }}>
          <b>Department: </b> {student?.department?.departmentName || 'Loading...'}
        </Typography>

        <Button
          onClick={() => setOpen(true)}
          sx={{ mt: 2, backgroundColor: '#524fe8', '&:hover': { backgroundColor: '#403ddc' }, color: '#fff' }}
          variant="contained"
        >
          Edit Profile
        </Button>
      </Paper>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'rgba(0, 0, 0, 0.4)',
          p: 4, borderRadius: 3,
          backdropFilter: 'blur(10px)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography variant="h6" gutterBottom>Edit Profile</Typography>
          <TextField
            fullWidth
            label="First Name"
            value={student.firstName || ''}
            onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
            sx={{ mb: 2, input: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Middle Name"
            value={student.middleName || ''}
            onChange={(e) => setStudent({ ...student, middleName: e.target.value })}
            sx={{ mb: 2, input: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={student.lastName || ''}
            onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
            sx={{ mb: 2, input: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            type="number"
            label="Year Level"
            value={student.yearLevel || ''}
            onChange={(e) => setStudent({ ...student, yearLevel: parseInt(e.target.value) })}
            sx={{ mb: 2, input: { color: '#fff' } }}
          />
          <TextField
            fullWidth
            select
            label="Department"
            value={student.departmentId || ''}
            onChange={(e) => setStudent({ ...student, departmentId: parseInt(e.target.value) })}
            sx={{ mb: 2, input: { color: '#fff' } }}
          >
            {departments.map(dep => (
              <MenuItem key={dep.departmentId} value={dep.departmentId}>
                {dep.departmentName}
              </MenuItem>
            ))}
          </TextField>
          <Button component="label" variant="outlined" sx={{ mb: 2 }}>
            Upload Profile Picture
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => (e.target.files[0])}
            />
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={handleSubmit}
            sx={{ backgroundColor: '#524fe8', '&:hover': { backgroundColor: '#403ddc' } }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Changes'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default StudentProfile;
