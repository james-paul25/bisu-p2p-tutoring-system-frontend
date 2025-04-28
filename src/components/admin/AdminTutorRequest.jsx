import React, {useEffect, useMemo, useCallback, useState} from 'react';
import {Box, Grid, Typography, Paper} from '@mui/material';

import { toast } from 'react-toastify';
import { Table, TableContainer, TableCell, TableRow, TableHead, TableBody} from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem , TextField, Button} from '@mui/material';
import debounce from 'lodash.debounce';


const AdminTutorRequest = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [tutors, setTutors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchTutors = useCallback(async () => {
        try {
          const response = await fetch(`${baseUrl}/tutors/get-all-tutors`);
          if (!response.ok) throw new Error('Failed to fetch subjects');
          const data = await response.json();
          setTutors(data);
          console.log("Tutors: ", data);
        } catch (error) {
          toast.error('Error loading subjects: ' + error.message);
        }
      }, [baseUrl]);

      const handleApproved = async (tutorId, action) => {
          try {
            const res = await fetch(`${baseUrl}/tutors/approved/${tutorId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' }
            });
      
            if (!res.ok) throw new Error('Failed to update session');
            toast.success(`Tutor ${action.toLowerCase()} successfully`);
            fetchTutors();
          } catch (error) {
            toast.error(error.message);
          }
        };

      const handleReject = async (tutorId, action) => {
        try {
            const res = await fetch(`${baseUrl}/tutors/rejected/${tutorId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' }
            });
      
            if (!res.ok) throw new Error('Failed to update session');
            toast.success(`Tutor ${action.toLowerCase()} successfully`);
            fetchTutors();
          } catch (error) {
            toast.error(error.message);
          }
      }

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
  
      const handleFilterChange = (event) => {
          setStatusFilter(event.target.value);
        };

      

      useEffect(() => {
            let updated = [...tutors];
        
            if (searchQuery) {
              updated = updated.filter((s) => {
                const tutorId = s.tutorId?.toString() || '';
                const name = s.student?.fullname?.toLowerCase() || '';
                const email = s.user?.email?.toLowerCase();
                const gwa = s.gwa?.toString();
                
                return (
                  tutorId.includes(searchQuery) ||
                  name.includes(searchQuery) ||
                  email.includes(searchQuery) ||
                  gwa.includes(searchQuery)
                );
              });
            }

            if (statusFilter) {
              updated = updated.filter((s) => s.status === statusFilter);
            }
        
            setFilteredSessions(updated);
      }, [searchQuery, tutors, statusFilter]);


    useEffect(() => {
      fetchTutors();
    }, [fetchTutors]);

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
                         Student Request as Tutor
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

              <Box sx={{ display: 'flex', gap: 2, mb: 3,  justifyContent: 'center' }}>
                                  <FormControl sx={{ minWidth: 150 }}>
                                          <InputLabel>Status</InputLabel>
                                          <Select
                                              value={statusFilter}
                                              onChange={handleFilterChange}
                                              label="Status"
                                          >
                                              <MenuItem value="">All</MenuItem>
                                              <MenuItem value="APPROVED">APPROVED</MenuItem>
                                              <MenuItem value="REJECTED">REJECTED</MenuItem>
                                              <MenuItem value="PENDING">PENDING</MenuItem>
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
          <Table sx={{ minWidth: 650 }} aria-label="subjects table">
            <TableHead sx={{ }}>
              <TableRow >
                <TableCell><b>Tutor ID</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>GWA</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessions.map((tutors) => (
                <TableRow key={tutors.tutorId}>
                    <TableCell>{tutors.tutorId}</TableCell>
                    <TableCell>{tutors.student.fullName || 'N/A'}</TableCell>
                    <TableCell>{tutors.user.email || 'N/A'}</TableCell>
                    <TableCell>{tutors.gwa || 'N/A'}</TableCell>
                    <TableCell>{tutors.status || 'N/A'}</TableCell>
                    <TableCell>
                    {tutors.status === 'PENDING' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleApproved(tutors.tutorId, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleReject(tutors.tutorId, 'REJECTED')}
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
}

export default AdminTutorRequest;