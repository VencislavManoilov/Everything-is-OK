import React, { useState } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(URL+"/login", {
                username: username,
                password: password
            }, { withCredentials: true });

            if(response.data.success) {
                window.location.href = "/";
            }
        } catch(err) {
            if(err.response.data.errors) {
                let msg = "";
                for(let i = 0; i < err.response.data.errors.length; i++) {
                    msg += err.response.data.errors[i] + "\n";
                }
                setError(msg.replace(/\n/g, '<br>'));
            } else {
                setError((err.response.data.error) ? err.response.data.error : "Login failed! Please check your information");
            }
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2>Login</h2>
                        </div>
                        <div className="card-body">
                            {error && 
                            <div className="alert alert-danger alert-dismissible">
                                <div dangerouslySetInnerHTML={{ __html: error }}></div>
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="username" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>

                                <div className="row align-items-center">
                                    <button type="submit" className="btn btn-primary btn-block col-auto ms-3">Login</button>
                                    <p className="col-auto" style={{margin: 0}}>You don't have an account! <a href="/register">Register</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;