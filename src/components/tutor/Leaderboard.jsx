import React, {useState, useEffect, useCallback} from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
  } from "@mui/material";
import { toast } from "react-toastify";



const Leaderboard = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [leaderboard, setLeaderboard] = useState([]);

    const fetchLeaderboard = useCallback(async () => {
        try {
          
          const ratingsRes = await fetch(`${baseUrl}/rates/average`);
          if (!ratingsRes.ok) throw new Error("Failed to fetch ratings");
      
          const ratingsData = await ratingsRes.json(); 
          console.log("Ratings Data: ", ratingsData);
    
          const tutorsRes = await fetch(`${baseUrl}/tutors/get-all-tutors`);
          if (!tutorsRes.ok) throw new Error("Failed to fetch tutors");
      
          const tutorsData = await tutorsRes.json(); 
      
          const merged = ratingsData
            .map((rate) => {
              const tutor = tutorsData.find((t) => t.tutorId === rate.tutorId);
              return tutor
                ? {
                    tutorId: rate.tutorId,
                    rating: rate.averageRating,
                    fullName: tutor.student?.fullName || "N/A",
                  }
                : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
      
          setLeaderboard(merged);
        } catch (error) {
          console.error(error);
          toast.error("Could not load leaderboard");
        }
      }, [baseUrl]);
      

    useEffect(() => {
        fetchLeaderboard();
      }, [fetchLeaderboard]);

      console.log("Leaderboard: ", leaderboard);


    return(
        <Box
            sx={{
                width: '85vw',
                minHeight: '100vh',
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
            <Grid item xs={12} md={10} sx={{ mt: 4, width: '95%'}}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#213448',  borderRadius: 5, boxShadow: 5 }}>
                <Typography variant="h4" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                    Leaderboard
                </Typography>
                <Typography variant="body1" gutterBottom color="#ECEFCA" fontFamily={'heavyweight'} fontWeight={700}>
                    This is the leaderboard for the tutors.
                </Typography>
                </Paper>
            </Grid>

        <TableContainer component={Paper} sx={{ mt: 2, width: '80%' , borderRadius: 2, backgroundColor: '#94B4C1'
            , boxShadow: 5
}}>
            <Grid item xs={12} md={10} sx={{ mt: 0, width: '95%' }}>
            <Table sx={{ minWidth: 650 }} aria-label="sessions table">
            <TableHead> 
              <TableRow>
                <TableCell><b>Rank</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Rate</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {leaderboard.map((tutor, index) => (
                <TableRow key={tutor.tutorId}>
                  <TableCell>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </TableCell>
                  <TableCell>{tutor.fullName || "N/A"}</TableCell>
                  <TableCell>{tutor.rating?.toFixed(1) ?? "N/A"} ⭐</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </Grid>
        </TableContainer>

        </Box>

    );
}

export default Leaderboard;