
import supabase from '../supabase';
import React, { useState } from 'react';
import { Grid, TextField, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; 

const LoginPage = ({setAuth, setUser}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  // Check for valid username and password
  if (!username.trim()) {
    setError('Username is required');
    return;
  }
  if (!password.trim()) {
    setError('Password is required');
    return;
  }

  try {
    // Retrieve user from the custom user table based on username and password
    const { data: users, error } = await supabase
      .from('users') 
      .select('*')
      .eq('username', username)
      .eq('password', password);

    if (error) {
      throw error;
    }

    if (users.length === 0) {
      setError('Invalid username or password');
      return;
    }

    const user = users[0]; // Assuming usernames are unique

    // Handle successful login
    console.log('Login successful:', user);

    // Update authorization status to true
    setAuth(true);

    // Update user state with the logged-in user's username
    setUser(user);

    // Navigate to home page
    navigate("/", { replace: true });

  } catch (error) {
    console.error('Error logging in:', error.message);
    setError(error.message);
  }
};

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '25vh', marginTop: "50px" }}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="h4" component="div" gutterBottom align="center">
            Welcome to Inquisitor!
          </Typography>
          <Typography variant="h6" component="div" gutterBottom align="center">
            Log into your account
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          {error && <p>{error}</p>}
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
          <p>Don't have an account? <Link to="/AccountCreation">Create one</Link></p>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default LoginPage;