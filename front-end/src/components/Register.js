import React, { useState } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await axios.post(URL+"/register", {
                username: username,
                email: email,
                password: password
            }, { withCredentials: true });

            if(response.data.success) {
                setLoading(false);
                window.location.href = "/";
            }
        } catch(err) {
            setLoading(false);
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

    if(loading) {
        return (
            <div className="w-100 vh-100 text-center align-content-center">
                <div className="spinner-border text-center mx-auto" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2>Register</h2>
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
                                    <label htmlFor="email">Email address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
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
                                    <button type="submit" className="btn btn-success btn-block col-auto ms-3">Register</button>
                                    <p className="col-auto" style={{margin: 0}}>You already have an account! <a href="/login">Login</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;