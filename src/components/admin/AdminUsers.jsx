import React, {useEffect, useCallback, useState, useMemo} from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import { Table, TableContainer, TableCell, TableRow, TableHead, TableBody } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem , TextField, Button} from "@mui/material";
import debounce from "lodash.debounce";

const AdminUsers = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [users, setUsers] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');


    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(`${baseUrl}/users/get-all-users`);
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
            console.log("Users: ", data);
        } catch (error) {
            console.error(error);
        }
    }, [baseUrl]);
          
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
        let updated = [...users];
    
        if (searchQuery) {
        updated = updated.filter((s) => {
            const username = s.username?.toLowerCase() || '';
            const email = s.email?.toLowerCase() || '';
            const userId = s.userId?.toString() || '';
            return (
            userId.includes(searchQuery) ||
            email.includes(searchQuery) ||
            username.includes(searchQuery)
            );
        });
        }

        if (statusFilter) {
            updated = updated.filter((s) => s.role === statusFilter);
          }
    
        setFilteredSessions(updated);
    }, [searchQuery, users, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    
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
                         Users
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
                            <InputLabel>Filter</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={handleFilterChange}
                                label="Status"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="TUTOR">TUTOR</MenuItem>
                                <MenuItem value="STUDENT">STUDENT</MenuItem>
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
                <TableCell><b>User ID</b></TableCell>
                <TableCell><b>Username</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessions.map((users) => (
                <TableRow key={users.userId}>
                    <TableCell>{users.userId}</TableCell>
                    <TableCell>{users.username || 'N/A'}</TableCell>
                    <TableCell>{users.email || 'N/A'}</TableCell>
                    <TableCell>{users.role || 'N/A'}</TableCell>
                    
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

export default AdminUsers;