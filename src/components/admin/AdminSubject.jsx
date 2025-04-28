import React , {useState, useEffect, useCallback, useMemo} from 'react';
import {Box, Paper, Grid, Typography, TextField,
    TableContainer, 
    Table, TableHead, TableRow, TableCell, 
    TableBody, Button, Modal
    } from '@mui/material';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';

const AdminSubject = () => {


    const [subject, setSubject] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [subjectModal, setSubjectModal] = useState(false);
    const [newSubject, setNewSubject] = useState([]);

    
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchSubjects = useCallback(async () => {
            try {
              const res = await fetch(`${baseUrl}/subjects/get-all-subjects`);
              if (!res.ok) throw new Error('Failed to fetch sessions');
              const data = await res.json();
              setSubject(data);
            } catch (error) {
              console.error(error);
            }
    }, [baseUrl]);
   

    console.log(subject);

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

    console.log("search:"+filteredSessions);

    useEffect(() => {
        let updated = [...subject];
    
       
    
        if (searchQuery) {
          updated = updated.filter((s) => {
            const subjectId = s.subjectId?.toString() || '';
            const subjectDescription = s.subjectDescription?.toLowerCase() || '';
            const subjectName = s.subjectName?.toLowerCase();
            return (
              subjectName.includes(searchQuery) ||
              subjectDescription.includes(searchQuery) ||
              subjectId.includes(searchQuery)
            );
          });
        }
    
        setFilteredSessions(updated);
      }, [subject, searchQuery]);

    
      useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);


    const handleAddSubject = async () => {
      setSubjectModal(false);
      try {
        const res = await fetch(`${baseUrl}/subjects/add-subject`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubject),
        });
    
        if (!res.ok) throw new Error(await res.text());
    
        toast.success("Subject added successfully!");
        await fetchSubjects(); 
        setNewSubject({}); 
      } catch (error) {
        toast.error("Failed to add subject: " + error.message);
      }
    };

    const handleDeleteSubject = async (subjectId) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                const res = await fetch(`${baseUrl}/subjects/delete-subject/${subjectId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) throw new Error('Failed to delete subject');
                toast.success("Subject deleted successfully!");
                fetchSubjects();
            } catch (error) {
                toast.error(error.message);
            }
        }
    }

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
                         Subjects
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
                    <TextField
                                label="Search"
                                variant="outlined"
                                onChange={handleSearchChange}
                                sx={{ minWidth: 200, flexGrow: 1, mx: 2 }}
                              />
                    <Button fullWidth variant="outlined" onClick={() => setSubjectModal(true)} sx={{ mt: 2,}}>Add Subject</Button>

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
                <TableCell><b>Subject ID</b></TableCell>
                <TableCell><b>Code</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessions.map((subject) => (
                <TableRow key={subject.subjectId}>
                    <TableCell>{subject.subjectId}</TableCell>
                    <TableCell>{subject.subjectName || 'N/A'}</TableCell>
                    <TableCell>{subject.subjectDescription || 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteSubject(subject.subjectId)}>Delete</Button>
                    </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Grid>
        </TableContainer>

        <Modal open={subjectModal} onClose={() => setSubjectModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 2 }}>Add Subject</Typography>
            <TextField
              fullWidth
              label="Subject Code eg. CC221"
              value={newSubject.subjectName || ''}
              onChange={(e) => setNewSubject({ ...newSubject, subjectName: e.target.value })}
              sx={{ mb: 2, input: { color: '#FFFFFF' } }}
            />

            <TextField
              fullWidth
              label="Subject Description eg. Computer Programming"
              value={newSubject.subjectDescription || ''}
              onChange={(e) => setNewSubject({ ...newSubject, subjectDescription: e.target.value })}
              sx={{ mb: 2, input: { color: '#FFFFFF' } }}
            />
            <Button fullWidth variant="contained" onClick={handleAddSubject}>Add Subject</Button>
          </Box>
        </Modal>
                
        </Paper>
        </Box>
    );
}

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: '#213448',
  p: 4, borderRadius: 3, color: '#94B4C1',
  backdropFilter: 'blur(5px)'
};

export default AdminSubject;