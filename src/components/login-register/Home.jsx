import React from 'react';
import Button from '@mui/material/Button';
import '../../assets/css/login.css';
import { useNavigate } from 'react-router-dom';
import "@fontsource/limelight";

function Home() {
  const navigate = useNavigate();



  return (
    <>
      <Button
        variant="contained"
        onClick={() => navigate("/admin-login")} 
        sx={{
          backgroundColor: '#524fe8',
          borderRadius: '200px',
          width: '60%',
          mb: 2
        }}
      >
       Sign In as Admin
      </Button>

      <Button
        variant="contained"
        onClick={() => navigate("/login")}
        sx={{
          backgroundColor: '#524fe8',
          borderRadius: '200px',
          width: '60%',
        }}
      >
        Sign In as User
      </Button>
    </>
  );
}

export default Home;
