import React from 'react';
import { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { axiosInstance, checkAuthenticated } from '../../utils';
import { Link } from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();


    function handlePasswordChange (event) {
        setPassword(event.target.value) 
    }

    function handleUserNameChange (event) {
        setUsername(event.target.value) 
    }

    function login(event) {
        event.preventDefault();
        axiosInstance.post("login/",{ username: username, password: password })
        .then(function(response) {
            if (response.status >= 200 && response.status <= 299) {
                setIsLoggedIn(true);
                navigate('/')
            } else {
                throw Error(response.statusText);
            }
        })
        .catch((err) => {
            console.log(err);
            setLoginError("Wrong username or password.");
        });
    }
    
    function handleLoggedIn (isAuth, data) {
        console.log(isAuth)
        console.log(data.isAuthenticated!==false)
        if (isAuth) {
            console.log("should be redirected")
            navigate('/')
        }
        console.log("You are logged in as: " + data.username);
    }

      useEffect(() => {
        checkAuthenticated(handleLoggedIn)
      },[])

      
    return (
        <div className="container mt-3">
            <h1>Exelixis</h1>
            <h2>Login</h2>
            <form onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={username} onChange={handleUserNameChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={password} onChange={handlePasswordChange} />
                    {loginError && <small className="text-danger">{loginError}</small>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
            </form>
            <div className="mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}

export default Login;