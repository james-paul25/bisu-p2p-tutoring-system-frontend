import React, {useEffect, useState, useCallback, useMemo} from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Table, TableContainer, TableCell, TableRow, TableHead, TableBody} from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem , TextField, Grid} from '@mui/material';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

const StudentList = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    const [students, setStudents] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [departments, setDepartments] = useState([]);

    const fetchStudentList = useCallback(async () => {
        try {
          const response = await fetch(`${baseUrl}/students/get-all-students`);
          if (!response.ok) throw new Error('Failed to fetch subjects');
          const data = await response.json();
          setStudents(data);
        } catch (error) {
          toast.error('Error loading subjects: ' + error.message);
        }
      }, [baseUrl]);

    const fetchDepartments = useCallback(async () => {
        try {
          const response = await fetch(`${baseUrl}/departments/getAllDepartment`);
          if (!response.ok) throw new Error('Failed to fetch departments');
          const data = await response.json();

          console.log("Departments: ", data);
          setDepartments(data);
        } catch (error) {
          toast.error('Error loading subjects: ' + error.message);
        }
      }
      , [baseUrl]);

   useEffect(() => {
       fetchStudentList();
        fetchDepartments();
     }, [ fetchStudentList, fetchDepartments]);

     console.log("Students: ", students);


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
    }

    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
    }

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
      };

    useEffect(() => {
        let updated = [...students];
        
        if (statusFilter) {
          updated = updated.filter((s) => s.department?.departmentName === statusFilter);
        }
    
        if (searchQuery) {
            updated = updated.filter((s) => {
            const studentName = s.fullName.toLowerCase() || '';
            const departmentName = s.department?.departmentName.toLowerCase() || '';
            const yearLevel = String(s.yearLevel).toLowerCase() || '';
            const email = s.user?.email.toLowerCase() || '';
            return (
              studentName.includes(searchQuery.toLowerCase()) || 
              departmentName.includes(searchQuery.toLowerCase()) ||
              yearLevel.includes(searchQuery.toLowerCase()) ||
              email.includes(searchQuery.toLowerCase())
            );
          });
        }
    
        if (sortOption === 'YEAR-LEVEL') {
          updated.sort((a, b) => a.yearLevel - b.yearLevel);
        } 

        setFilteredStudents(updated);
      }, [students, sortOption, searchQuery, statusFilter]);

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
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
         <Grid item xs={12} md={10} sx={{ mt: 2, width: '95%', mb: 2 }}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448',  borderRadius: 5, boxShadow: 5 }}>
                <Typography variant="h4" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                    List of Students
                </Typography>
            
                </Paper>
          </Grid>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 150, mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
                value={sortOption}
                onChange={handleSortChange}
                label="Sort By"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="YEAR-LEVEL">Year Level</MenuItem>
            </Select>
          </FormControl>

          <TextField
                      label="Search"
                      variant="outlined"
                      onChange={handleSearchChange}
                      sx={{ minWidth: 200, mb: 2, flexGrow: 1 }}
                    />
              <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={handleFilterChange}
                      label="Status"
                    >
                      <MenuItem value="">All</MenuItem>
                      {departments.map((d) => (
                        <MenuItem key={d.departmentId} value={d.departmentName}>
                          {d.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
          
        </Box>

    <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '80%',
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="sessions table">
            <TableHead>
              <TableRow>
                <TableCell><b>Student Name</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Year Level</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>{student.fullName || 'N/A'}</TableCell>
                  <TableCell>{student.department?.departmentName || 'N/A'}</TableCell>
                  <TableCell>{student.user?.email}</TableCell>
                  <TableCell>{student.yearLevel}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       
     
    </Box>
  );
};

export default StudentList;
