import React from 'react';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItemText, ListItemButton, Divider, Toolbar, Typography, Avatar, Stack, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

const drawerWidth = 260;

function StudentLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
    const role = 'ADMIN';
  const [Logoutloading, setLogoutLoading] = useState(false);

  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate("/admin-login");
    }
  }, [role, navigate]);

  const handleLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.clear();
      toast.success('Successfully logged out!');
      navigate("/admin-login");
      setLogoutLoading(false);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: 150,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#213448',
            color: '#FFFFFF',
            borderRight: 'none'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <div>
          <Toolbar>
            <Stack direction="column" alignItems="center" justifyContent="center" spacing={1} sx={{ width: '100%', mt: 2 }}>
              <Avatar alt={username} src="dasfa.jpg" sx={{
                width: 100,
                height: 100,
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
              }} />
              <Typography variant="h6">{username}</Typography>
            </Stack>
          </Toolbar>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <Typography variant="h6" align="center" sx={{ padding: 1, color: '#ffffff', fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <List>
            <ListItemButton onClick={() => navigate("/admin/admin-dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/admin/admin-subject")}>
              <ListItemText primary="Subjects" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/admin/admin-session")}>
              <ListItemText primary="Sessions" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/admin/admin-tutor-request")}>
              <ListItemText primary="Tutor Request" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/admin/admin-users")}>
              <ListItemText primary="Users" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout} disabled={Logoutloading}>
              {Logoutloading ? (
                <CircularProgress size={20} sx={{ color: '#ff0000', ml: 1 }} />
              ) : (
                <ListItemText sx={{ color: '#ff0000' }} primary="Logout" />
              )}
            </ListItemButton>
          </List>
        </div>
      </Drawer>

      <div style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default StudentLayout;
