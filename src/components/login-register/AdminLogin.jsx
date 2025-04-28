import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../assets/css/login.css';
import "@fontsource/limelight";
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';


function AdminLogin() { 
    const navigate = useNavigate();
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
    
    
        const handleLogin = async(e) => {
          e.preventDefault();
          
          if (!email || !password) {
            toast.error("Please fill in both fields.");
            return;
          }
    
          try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/admin/login`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });
        
            setTimeout(async () => {
              if (response.ok) {
                const data = await response.json();
    
                console.log('Login successful:', data);
                toast.success('Login Successful');
                localStorage.setItem("username", data.username);
                localStorage.setItem("adminId", data.adminId);
                navigate("/admin");
    
    
                setEmail("");
                setPassword("");
                
              } else {
                const errorData = await response.text();
                toast.error(errorData || "Login failed: Invalid credentials");
                console.error('Login failed:', errorData);
                setEmail("");
                setPassword("");
              }
        
              setLoading(false);
            }, 2000);
        
          } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred while logging in");
            setEmail("");
            setPassword("");
            setLoading(false);
          }
        };

  

    return (
        
          <div className="login-form">
            <h2 style={{fontFamily: 'Limelight, serif', fontSize: 35}}>Admin Login</h2>
            <form>
              <div className='form-field'>
                  <TextField 
                    id="email" label="Enter email" 
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
                          }}/>
                </div>
                <div className='form-field'>
                  <TextField id="password" label="Enter password" variant="outlined" 
                     type='password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     fullWidth 
                     sx={{
                       '& .MuiOutlinedInput-root': {
                          borderRadius: '50px', 
                       }, 
                          marginBottom: '50px',
                          height: '1px', 
                          }} />
                </div>
                <Button variant="contained" 
                        className='login-btn'
                        onClick={handleLogin}
                        sx={{
                          backgroundColor: '#524fe8;',
                          borderRadius: '200px',
                          width: '60%',
                         }}>
                          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign In"}
                          </Button>
                        <div className="register">
                         <p>Don't have an account?
                        <a href="#"onClick={(e) => {
                                  e.preventDefault();
                                  navigate("/admin-register");}}>
                        Register</a>
                    </p>
                  </div>       
            </form>
          </div>
        
      );
}

export default AdminLogin;