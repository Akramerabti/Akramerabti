import React from 'react';
import { useState, useEffect} from 'react';
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance, checkAuthenticated } from '../../utils';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [signUpError, setsignUpError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    function handleUsernameChange (event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange (event) {
        setPassword(event.target.value);
    }

    function signup (event) {
        event.preventDefault();
        axiosInstance.post("signup/",{ username: username, password: password })
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
            setsignUpError("Signup failed. Please check your input and try again.");
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
        <h5>Exelixis</h5>
        <br />
        <h3>Signup</h3>
        <form onSubmit={signup}>
            <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" id="username" name="username" value={username} onChange={handleUsernameChange} />
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" name="password" value={password} onChange={handlePasswordChange} />
            <div>
                {signUpError &&
                <small className="text-danger">
                    {signUpError}
                </small>
                }
            </div>
            </div>
            <button type="submit" className="btn btn-primary">Signup</button>
        </form>
        <div className="mt-3">
                Have an account? <Link to="/login">Login</Link>
            </div>
    </div>
  )
}

export default Login