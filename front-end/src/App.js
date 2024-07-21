import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const InitComponent = ({ user, onRegisterGuest }) => {
    return user ? (
        <div>
            <div>{ user.guest ? "Guest" : "User" }</div>
            { !user.guest ? (
                    <div>
                        <div>{ user.username }</div>
                        <div>{ user.email }</div>
                    </div>
                ) : (<></>)
            }
        </div>
    ) : (
        <div className="container">
            <button className="btn btn-success">Register</button>
            <button className="btn btn-primary">Login</button>
            <button className="btn btn-secondary" onClick={() => {onRegisterGuest()}}>Guest</button>
        </div>
    )
}

function App() {
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(URL+"/user", { withCredentials: true });
                if (response.data) {
                    setUser(response.data.user);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
            }
        }

        checkLoginStatus();
    }, []);

    const RegisterGuest = async () => {
        try {
            const response = await axios.post(URL+"/register-guest", {}, { withCredentials: true });
            console.log(response);
            setUser({guest: true});
        } catch (error) {
            setLoading(false);
        }
    }

    if(loading) {
        return <div>loading...</div>
    }

    return (
        <Router>
            <Routes>
                <Route path='/' element={<InitComponent user={user} onRegisterGuest={RegisterGuest} />} />
            </Routes>
        </Router>
    );
}

export default App;
