import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Grid, Card, CardContent,
  Select, MenuItem, InputLabel, FormControl, TextField
} from '@mui/material';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import { useMemo } from 'react';


const TutorSession = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const tutorId = localStorage.getItem('tutorId');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

 

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/sessions/get-session-by-tutor/${tutorId}`);
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error(error);
    }
  }, [baseUrl, tutorId]);

  const handleAction = async (sessionId, action) => {
    try {
      const res = await fetch(`${baseUrl}/sessions/update-status/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      });

      if (!res.ok) throw new Error('Failed to update session');
      toast.success(`Session ${action.toLowerCase()} successfully`);
      fetchSessions();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const debouncedSearch = useMemo(() => 
    debounce((query) => {
      setSearchQuery(query.toLowerCase());
    }, 300),
  []);
  
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };

  useEffect(() => {
    let updated = [...sessions];

    if (statusFilter) {
      updated = updated.filter((s) => s.sessionStatus === statusFilter);
    }

    if (searchQuery) {
      updated = updated.filter((s) => {
        const studentName = s.student?.fullName?.toLowerCase() || '';
        const subjectName = s.subject?.subjectName?.toLowerCase() || '';
        const subjectDesc = s.subject?.subjectDescription?.toLowerCase() || '';
        return (
          studentName.includes(searchQuery) ||
          subjectName.includes(searchQuery) ||
          subjectDesc.includes(searchQuery)
        );
      });
    }

    if (sortOption === 'DATE') {
      updated.sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));
    } else if (sortOption === 'TIME') {
      updated.sort((a, b) => {
        const [aHours, aMinutes] = a.sessionTime.split(':').map(Number);
        const [bHours, bMinutes] = b.sessionTime.split(':').map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });
    }

    setFilteredSessions(updated);
  }, [sessions, statusFilter, sortOption, searchQuery]);

  useEffect(() => {
    fetchSessions();
  }, [ fetchSessions]);

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
            
            alignItems: 'center',
            flexDirection: 'column',
            p: 2,
            overflowY: 'auto',
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >

          <Grid item xs={12} md={10} sx={{ mt: 2, width: '95%' }}>
                          <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448', borderRadius: 2, boxShadow: 5 }}>
                          <Typography variant="h4" gutterBottom color='#ECEFCA' fontFamily={'heavyweight'} fontWeight={700}>
                              My Sessions
                          </Typography>
                          
                          </Paper>
                      </Grid>

          <Paper
            elevation={8}
            sx={{
              width: '90%',
              maxWidth: 1200,
              marginTop: 3,
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

        <Box sx={{ display: 'flex', gap: 2, mb: 3,  justifyContent: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleFilterChange}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>  

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="DATE">Date</MenuItem>
              <MenuItem value="TIME">Time</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Search"
            variant="outlined"
            onChange={handleSearchChange}
            sx={{ minWidth: 200, flexGrow: 1, mx: 2 }}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            background: '#94B4C1',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '80%', backgroundColor: '#94B4C1'
          }}
        >
            <Grid item xs={12} md={10} sx={{ mt: 0, width: '98%' }}>
          <Table sx={{ minWidth: 650 }} aria-label="sessions table">
            <TableHead sx={{ }}>
              <TableRow >
                <TableCell><b>Student Name</b></TableCell>
                <TableCell><b>Subject</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Time</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.sessionId}>
                  <TableCell>{session.student?.fullName || 'N/A'}</TableCell>
                  <TableCell>
                    {session.subject?.subjectName || 'N/A'} - {session.subject?.subjectDescription || ''}
                  </TableCell>
                  <TableCell>{session.sessionDate}</TableCell>
                  <TableCell>{formatTo12Hour(session.sessionTime)}</TableCell>
                  <TableCell>{session.sessionStatus}</TableCell>
                  <TableCell>
                    {session.sessionStatus === 'PENDING' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleAction(session.sessionId, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleAction(session.sessionId, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Grid>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TutorSession;
