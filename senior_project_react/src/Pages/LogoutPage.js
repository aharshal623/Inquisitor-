import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LogoutPage = ({ setAuth, setUser }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Update authorization status to false
        setAuth(false);
        // Update user state to null or empty value upon logout
        setUser(null);
        // Navigate back to the login page
        navigate("/", { replace: true });
    };

    const handleCancel = () => {
    // Navigate to home
    window.location.href = "/Home";
  };

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '25vh', marginTop: "50px" }}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="h4" component="div" gutterBottom align="center">
                Are you sure you want to log out?
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Button variant="outlined" color="primary"  onClick={handleCancel}>No, take me back to home.</Button>
        </Grid>
        <Grid item xs={12}>
            <Button variant="contained" color="primary"  onClick={handleLogout}>Yes, log me out.</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default LogoutPage;