import React, { useState } from "react";
import UserLogin from "./UserLogin.jsx";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import "../../assets/css/login.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "@fontsource/limelight";

function UserRegister() {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !repeatPassword) {
            toast.error("Please fill in all fields.");
            setUsername("");
            setEmail("");
            setPassword("");
            setRepeatPassword("");
            return;
        }

        if (password !== repeatPassword) {
            toast.error("Passwords do not match.")
            setPassword("");
            setRepeatPassword("");
            return;
        }

        try {
          setLoading(true);
          const response = await fetch(`${baseUrl}/users/registration`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, email, password }),
          });
  
          setTimeout(async () => {
              if (response.ok) {
                  const data = await response.text();
                  console.log('Registration successful:', data);
                  toast.success("Registration successful");
                  navigate("/login");
              } else {
                  const errorData = await response.text();
                  toast.error("Registration failed: " + errorData)
                  console.error('Registration failed:', errorData);
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setRepeatPassword("");
              }
              setLoading(false);
          }, 2000);
  
      } catch (error) {
          console.error('Error:', error);
          toast.error("An error occured while registering");
          setUsername("");
          setEmail("");
          setPassword("");
          setRepeatPassword("");
          setLoading(false);
      }
    };

    return (
        
            <div className="login-form">
                <h2 style={{fontFamily: 'Limelight, serif', fontSize: 35}}>Register</h2>
                <form>
                    <div className='form-field'>
                        <TextField
                            id="username" label="Username"
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined" fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                },
                                marginBottom: '50px',
                                height: '1px',
                            }} />
                    </div>
                    <div className='form-field'>
                        <TextField
                            id="email" label="Email"
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined" fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                },
                                marginBottom: '50px',
                                height: '1px',
                            }} />
                    </div>
                    <div className='form-field'>
                        <TextField
                            id="password" label="Password"
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined" fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                },
                                marginBottom: '50px',
                                height: '1px',
                            }} />
                    </div>
                    <div className='form-field'>
                        <TextField
                            id="repeat-password" label="Repeat Password"
                            type='password'
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            variant="outlined" fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                },
                                marginBottom: '50px',
                                height: '1px',
                            }} />
                    </div>

                    <Button
                        variant="contained"
                        className='login-btn'
                        onClick={handleRegister}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#524fe8',
                            borderRadius: '200px',
                            width: '60%',
                        }}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
                    </Button>

                    <div className="register">
                        <p>Already have an account?
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                            }}>
                                Sign In
                            </a>
                        </p>
                    </div>
                </form>
            
        </div>
    );
}

export default UserRegister;
