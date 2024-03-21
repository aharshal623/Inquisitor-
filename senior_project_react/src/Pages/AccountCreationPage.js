import React, { useState } from 'react';
import { Grid, TextField, Button, Typography } from '@mui/material';
import supabase from '../supabase'; 
import { useNavigate } from 'react-router-dom'; 

const AccountCreationPage = ({setAuth, setUser}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
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
        //Check if username already exists
      const { data: existingUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

      if (error) {
        throw error;
      } 

      if (existingUsers.length > 0) {
        setError('Username already exists');
        return;
      }
  
      // Insert new user into the custom user table
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([{ username, password }]);
  
      if (createUserError) {
        throw createUserError;
      }

      // Log in on the user's behalf
      // Retrieve new user entry — to get the id, etc.
      const { data: supaData, error: supaError } = await supabase
      .from('users') 
      .select('*')
      .eq('username', username)
      .eq('password', password);

      if (supaError) {
        throw supaError;
      }

      console.log('Account created successfully:', newUser);

      if (supaData.length === 0) {
        // Navigate to login page because our retreival from supabase didn't work
        window.location.href = "/Login";
      } else {
        const user = supaData[0];
        // Update authorization status to true
        setAuth(true);
        // Update user state with the logged-in user's username
        setUser(user);
        // Navigate to home page
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error('Error creating account:', error.message);
      setError(error.message);
    }
  };

  return (
    <div>
     <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '25vh', marginTop: "50px" }}>
     <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="h4" component="div" gutterBottom align="center">
            Let's get started!
          </Typography>
          <Typography variant="h6" component="div" gutterBottom align="center">
            Choose your username and password
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
        <Button variant="contained" color="primary" onClick={handleCreateAccount}>
            Create Account
        </Button>
      </Grid>
      </Grid>
    </div>
  );
};

export default AccountCreationPage;

