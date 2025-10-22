import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); 

  return (
    <Routes>      
      <Route 
        path="/" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
      
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
      />

      <Route 
        path="/register" 
        element={!isAuthenticated ? <Register /> : <Navigate to="/login" />} 
      />
    </Routes>    
  );
}

export default App;