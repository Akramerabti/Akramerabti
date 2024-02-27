import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { checkAuthenticated } from '../../utils';
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkAuthenticated((isAuthenticated, data) => {
            setIsLoggedIn(isAuthenticated);
            if (isAuthenticated) {
                navigate('/', { replace: true }); // Redirect to home page
            }
        });
    }, []);

    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;