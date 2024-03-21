import './App.css';
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import HomePage from './Pages/HomePage.js';
import NavBar from './Components/NavBar.js';
import LoginPage from './Pages/LoginPage';
import PostPage from './Pages/PostPage';
import AccountPage from './Pages/AccountPage';
import LogoutPage from './Pages/LogoutPage.js';
import ActivityPage from './Pages/ActivityPage';
import AccountCreationPage from './Pages/AccountCreationPage.js';
import ArticlePage from './Pages/ArticlePage.js';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import globalFontTheme from './Styles/FontTheme'; 

function App() {
  
  // Initialize logged in status from localStorage or default to false
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('auth')) || false
  );

  // Function to set logged in status and update state
  const setAuth = (value) => {
    setIsAuthenticated(value);
  };

  // Initialize user information
  const [user, setUserState] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );

  // Function to set user status and update state
  const setUser = (user_value) => {
    setUserState(user_value);
  };

  // Update localStorage whenever logged in status changes
  useEffect(()=>{
    localStorage.setItem("auth", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));  // needed to persist user data after page refresh
  }, [user]);
  
  return (
    <div className="App">
       {/* Maintain global font */}
       <ThemeProvider theme={globalFontTheme}> 
      {isAuthenticated && <NavBar user={user}/>} 
      <Routes> 

        {/* Public routes accessible regardless of logged in status*/}
        <Route  
          path="/"
          element={isAuthenticated ? <Navigate to="/Home" /> : <Navigate to = "/Login" replace/>}
        /> 
        <Route path="/Login" element={<LoginPage setAuth={setAuth} setUser={setUser} />} />
        <Route path="/AccountCreation" element={<AccountCreationPage setAuth={setAuth} setUser={setUser} />} />
        
        {/* Private routes accessible only if logged in) */}
        {isAuthenticated ? (
          <>
          <Route path="/Home" element={<HomePage/>} />
          <Route path="/Post" element={<PostPage user={user} />} /> 
          <Route path="/Account" element={ <AccountPage user={user} />} />
          <Route path="/Logout" element={<LogoutPage setAuth={setAuth} setUser={setUser} />} />
          <Route path="/Activity" element={<ActivityPage user={user} />} />
          <Route path="/Article" element={<ArticlePage user={user} />} />

          </>
        ) : ( 
          <Route path="*" element={<Navigate to ="/Login" replace />} /> 
        )}
      </Routes>
      </ThemeProvider>
      
    </div>
  );
}
export default App;