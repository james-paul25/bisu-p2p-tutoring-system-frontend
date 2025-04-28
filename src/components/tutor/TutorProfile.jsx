import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Modal, TextField, MenuItem,
  Avatar, CircularProgress, Paper, Grid, Card, CardContent
} from '@mui/material';
import { toast } from 'react-toastify';

const TutorProfile = () => {
  const [student, setStudent] = useState({});
  const [open, setOpen] = useState(false);
  const [subjectModal, setSubjectModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tutorSubjects, setTutorSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ subjectId: '', grade: '' });

  const userId = localStorage.getItem('userId');
  const tutorId = localStorage.getItem('tutorId');
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/departments/getAllDepartment`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      toast.error('Error loading departments: ' + error.message);
    }
  }, [baseUrl]);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/subjects/get-all-subjects`);
      if (!response.ok) throw new Error('Failed to fetch subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      toast.error('Error loading subjects: ' + error.message);
    }
  }, [baseUrl]);

  const fetchStudentProfile = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/users/get-student-info/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch student profile');
      const studentData = await res.json();
      setStudent(studentData);
      setTutorSubjects(studentData?.tutorSubjects || []);
    } catch (error) {
      toast.error('Error loading profile: ' + error.message);
    }
  }, [baseUrl, userId]);

  useEffect(() => {
    fetchDepartments();
    fetchStudentProfile();
    fetchSubjects();
  }, [fetchDepartments, fetchStudentProfile, fetchSubjects]);

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

  const handleAddSubject = async () => {
    if (!newSubject.subjectId || !newSubject.grade) {
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/tutor-subjects/tutor-add-subject/${tutorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: parseInt(newSubject.subjectId),
          grade: parseFloat(newSubject.grade)
        }),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg);
      }

      toast.success("Subject added successfully!");
      setSubjectModal(false);
      setNewSubject({ subjectId: '', grade: '' });
      fetchStudentProfile();
    } catch (error) {
      toast.error("Failed to add subject: " + error.message);
    }
  };

  console.log(tutorSubjects);

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
                <Grid item xs={12} md={10} sx={{ mt: 4, width: '95%', mb: 2 }}>
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
              color: '#000',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
  
        <Avatar src="dasfa.jpg" sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
        <Typography ><b>First Name:</b> {student.firstName}</Typography>
        <Typography><b>Middle Name:</b> {student.middleName}</Typography>
        <Typography><b>Last Name:</b> {student.lastName}</Typography>
        <Typography><b>Year Level:</b> {student.yearLevel}</Typography>
        <Typography><b>Department:</b> {student?.department?.departmentName || 'Loading...'}</Typography>

        <Button onClick={() => setOpen(true)} sx={{ mt: 2 }} variant="contained">Edit Profile</Button>
        <Button onClick={() => setSubjectModal(true)} sx={{ mt: 2,}} variant="outlined">Add Subject</Button>
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
          <Typography variant="h6" mb={2}>Edit Profile</Typography>
          {['firstName', 'middleName', 'lastName'].map(field => (
            <TextField
              key={field}
              fullWidth
              label={field.replace(/^\w/, c => c.toUpperCase())}
              value={student[field] || ''}
              onChange={(e) => setStudent({ ...student, [field]: e.target.value })}
              sx={{ mb: 2, input: { color: '#fff' } }}
            />
          ))}
          <TextField
            fullWidth type="number" label="Year Level"
            value={student.yearLevel || ''}
            onChange={(e) => setStudent({ ...student, yearLevel: parseInt(e.target.value) })}
            sx={{ mb: 2, input: { color: '#fff' } }}
          />
          <TextField
            fullWidth select label="Department"
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
            <input type="file" accept="image/*" hidden />
          </Button>
          <Button fullWidth variant="contained" disabled={loading} onClick={handleSubmit}>
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Changes'}
          </Button>
        </Box>
      </Modal>

      <Modal open={subjectModal} onClose={() => setSubjectModal(false)}>
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
          <Typography variant="h6" sx={{ mb: 2 }}>Add Subject</Typography>
          <TextField
            select
            fullWidth
            label="Subject"
            value={newSubject.subjectId}
            onChange={(e) => setNewSubject({ ...newSubject, subjectId: e.target.value })}
            sx={{ mb: 2, input: { color: '#FFFFFF' } }}
          >
            {subjects.map(sub => (
              <MenuItem key={sub.subjectId} value={sub.subjectId}>{sub.subjectName}-{sub.subjectDescription}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Grade"
            type="number"
            value={newSubject.grade}
            onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}
            sx={{ mb: 2, input: { color: '#FFFFFF' } }}
          />
          <Button fullWidth variant="contained" onClick={handleAddSubject}>Add Subject</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TutorProfile;
