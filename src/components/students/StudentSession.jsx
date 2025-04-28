import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from "@mui/material";

import { toast } from "react-toastify";

const StudentSession = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const studentId = localStorage.getItem("studentId");

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");
  const [searchTerm, setSearchTerm] = useState(""); 

  const [openDialog, setOpenDialog] = useState(false);
const [selectedTutorId, setSelectedTutorId] = useState(null);
const [ratingValue, setRatingValue] = useState(0);


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${baseUrl}/sessions/get-session-by-student/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();

        console.log("Sessions Data: ", data);

        const mySessions = data.filter(s =>
          String(s.student?.studentId || s.studentId) === studentId
        );

        setSessions(mySessions);
        setFilteredSessions(mySessions);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [baseUrl, studentId]);

  useEffect(() => {
    let filtered = [...sessions];


    if (statusFilter !== "All") {
      filtered = filtered.filter(session => session.sessionStatus === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          (session.subject?.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.tutor?.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortOption === "Newest") {
      filtered.sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
    } else if (sortOption === "Oldest") {
      filtered.sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));
    }

    setFilteredSessions(filtered);
  }, [statusFilter, sortOption, sessions, searchTerm]);

  const handleRateTutor = async () => {
    try {
      const response = await fetch(`${baseUrl}/rates/student-rate-tutor/${studentId}/${selectedTutorId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating: ratingValue }),
        }
      );
  
      const result = await response.text();
  
      if (response.ok) {
        toast.success(result);
      } else {
        toast.error(result);
      }
    } catch (err) {
      console.error(err);
      toast.error("Rating failed. Try again later.");
    } finally {
      setOpenDialog(false);
      setRatingValue(0);
      setSelectedTutorId(null);
    }
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
                                                          MY SESSION
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

        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="APPROVED">APPROVED</MenuItem>
              <MenuItem value="REJECTED">REJECTED</MenuItem>
            </Select>
          </FormControl>

          <TextField
          label="Search by Tutor or Subject"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2, minWidth: 200, flexGrow: 1, mx: 2 }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <CircularProgress sx={{ color: "#fff", mt: 4 }} />
        ) : filteredSessions.length === 0 ? (
          <Typography>No sessions scheduled.</Typography>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center">
            {filteredSessions.map((session, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    color: "#000",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <img
                    src={'/das.jpg'}
                    alt={session.tutor?.student?.fullName}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: 10,
                    }}
                  />
                  <Typography variant="h6">
                    {session.subject?.subjectName || "Unknown Subject"}
                  </Typography>
                  <Typography variant="h6">
                    {session.subject?.subjectDescription || "Unknown Description"}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    with {session.tutor?.student?.fullName || "Unknown Tutor"}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {session.sessionStatus}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Schedule at: {session.sessionDate} <br />
                    {formatTo12Hour(session.sessionTime.toLocaleString())}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSelectedTutorId(session.tutor?.tutorId);
                      setOpenDialog(true);
                    }}
                    
                    disabled={session.sessionStatus !== "APPROVED"}
                  >
                    Rate Tutor
                  </Button>

                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Rate Your Tutor</DialogTitle>
  <DialogContent>
    <Typography gutterBottom>How would you rate this tutor?</Typography>
    <Rating
      name="tutor-rating"
      value={ratingValue}
      onChange={(event, newValue) => setRatingValue(newValue)}
      precision={1}
    />
    </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleRateTutor}
              disabled={ratingValue === 0}
            >
              Submit
            </Button>
          </DialogActions>
      </Dialog>

    </Box>
  );
};

export default StudentSession;
