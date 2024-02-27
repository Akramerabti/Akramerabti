import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ContextWrapper from './pages/home/context/ContextWrapper'; // Import the ContextWrapper component
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import ProtectedRoute from './pages/login/ProtectedRoute';
import './index.css';

function App() {
  return (
    <ContextWrapper> 
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </ContextWrapper>
  );
}

export default App;