import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { toast } from 'react-toastify';

const StudentTutor = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [tutors, setTutors] = useState([]);
  const [tutorSubjects, setTutorSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('created_at');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [currentTutor, setCurrentTutor] = useState(null);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsRes, subjectsRes] = await Promise.all([
          fetch(`${baseUrl}/tutors/get-all-tutors`),
          fetch(`${baseUrl}/tutor-subjects/get-all-subjects`),
        ]);

        if (!tutorsRes.ok || !subjectsRes.ok) {
          throw new Error('Failed to fetch tutors or subjects');
        }

        const tutorsData = await tutorsRes.json();
        const subjectsData = await subjectsRes.json();

        setTutors(tutorsData);
        setTutorSubjects(subjectsData);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  const handleApply = (tutorId, subjectId) => {
    setApplying((prev) => ({ ...prev, [`${tutorId}-${subjectId}`]: true }));

    setTimeout(() => {
      setSelectedTutor(tutorId);
      setSelectedSubject(subjectId);
      setApplying((prev) => ({ ...prev, [`${tutorId}-${subjectId}`]: false }));
      setOpenApplyModal(true);
    }, 1000);
  };

  const handleModalSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.warning('Please select date and time');
      return;
    }

    try {
      const res = await fetch(
        `${baseUrl}/sessions/students-apply-session/${selectedTutor}/${selectedSubject}/${studentId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionDate: selectedDate, sessionTime: selectedTime }),
        }
      );

      const text = await res.text();

      if (res.ok) {
        toast.success(text);
      } else {
        toast.error(text);
      }
    } catch (err) {
      console.error("Application error:" + err);
      toast.error("Something went wrong while applying." + err);
    } finally {
      setOpenApplyModal(false);
      setSelectedTutor(null);
      setSelectedSubject(null);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    if (statusFilter === 'ALL') return true;  
    return tutor.status === statusFilter;
  });

  const sortedTutors = filteredTutors
    .filter((tutor) => {
      const tutorName = tutor?.student?.fullName?.toLowerCase() || '';
      const tutorUsername = tutor?.student?.user?.username?.toLowerCase() || '';
      const tutorFirstName = tutor?.student?.firstName?.toLowerCase() || '';
      const tutorLastName = tutor?.student?.lastName?.toLowerCase() || '';
      const tutorSubjectsList = tutorSubjects
        .filter(subj => subj?.tutor?.tutorId === tutor?.tutorId)
        .map(subj => subj?.subject?.subjectName?.toLowerCase())
        .join(' ');
      const tutorSubjectsDescription = tutorSubjects
        .filter(subj => subj?.tutor?.tutorId === tutor?.tutorId)
        .map(subj => subj?.subject?.subjectDescription?.toLowerCase())
        .join(' ');

      return (
        tutorName.includes(searchTerm.toLowerCase()) ||
        tutorUsername.includes(searchTerm.toLowerCase()) ||
        tutorFirstName.includes(searchTerm.toLowerCase()) ||
        tutorLastName.includes(searchTerm.toLowerCase()) ||
        tutorSubjectsList.includes(searchTerm.toLowerCase()) ||
        tutorSubjectsDescription.includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'created_at') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortOrder === 'gwa') {
        return a.gwa - b.gwa;
      }
      return 0;
    });

  const handleViewSubjects = (tutor) => {
    const subjects = tutorSubjects.filter(subj => subj?.tutor?.tutorId === tutor?.tutorId);
    setCurrentSubjects(subjects);
    setCurrentTutor(tutor);
    setOpenSubjectModal(true);
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


      <Grid item xs={12} md={10} sx={{ mt: 4, width: '90%', mb: 0 }}>
                                      <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448',  borderRadius: 5, boxShadow: 5 }}>
                                      <Typography variant="h4" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                                          TUTORS
                                      </Typography>
                                      
                                      </Paper>
                                  </Grid>

      <Paper
        elevation={8}
        sx={{
          width: '80%',
          maxWidth: 1200,
          marginTop: 3,
          p: 5,
          borderRadius: 2,
          backgroundColor: '#94B4C1',
        }}
      >
       
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            label="Search by name or subject"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, minWidth: 200, flexGrow: 1, mx: 2 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort By">
              <MenuItem value="created_at">Created At</MenuItem>
              <MenuItem value="gwa">GWA</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#fff' }} />
          </Box>
        ) : sortedTutors.length === 0 ? (
          <Typography>No tutors found.</Typography>
        ) : (
          <Grid container spacing={4}>
            {sortedTutors
              .filter((tutor) => tutor.status !== 'REJECTED') 
              .map((tutor, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <img
                      src={'/das.jpg'}
                      alt={tutor?.student?.fullName || 'Profile'}
                      style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }}
                    />
                    <Typography variant="h6">{tutor?.student?.user?.username}</Typography>
                    <Typography variant="h6">{tutor?.student?.fullName || 'No name'}</Typography>
                    <Typography variant="body1">GWA: {tutor?.gwa || 'No GWA'}</Typography>
                    <Typography variant="body2">
                      Dept: {tutor?.student?.department?.departmentName || 'No department'}
                    </Typography>
                    <Typography variant="body2">
                      Year Level: {tutor?.student?.yearLevel || 'No year level'}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewSubjects(tutor)}
                      sx={{ mt: 2 }}
                    >
                      View Subjects
                    </Button>
                  </Paper>
                </Grid>
              ))}
          </Grid>

        )}
      </Paper>

      <Dialog open={openSubjectModal} onClose={() => setOpenSubjectModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Subjects for {currentTutor?.student?.fullName}</DialogTitle>
        <DialogContent dividers>
          {currentSubjects.map((subj, idx) => (
            <Box key={idx} mt={1}>
              <Typography variant="body1">
                • {subj?.subject?.subjectName} - {subj?.subject?.subjectDescription} - {subj?.grade}
              </Typography>
              {currentTutor?.status === 'APPROVED' ? (
                applying[`${currentTutor.tutorId}-${subj.subject.subjectId}`] ? (
                  <CircularProgress size={24} sx={{ mt: 1 }} />
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleApply(currentTutor.tutorId, subj.subject.subjectId)}
                    sx={{ mt: 1, borderRadius: 3 }}
                  >
                    Apply to this subject
                  </Button>
                )
              ) : (
                <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                  Tutor is pending approval
                </Typography>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubjectModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Apply Modal */}
      <Dialog open={openApplyModal} onClose={() => setOpenApplyModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select Session Date and Time</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time"
            type="time"
            fullWidth
            margin="normal"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplyModal(false)}>Cancel</Button>
          <Button onClick={handleModalSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentTutor;
