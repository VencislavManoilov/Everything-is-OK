import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const InitComponent = ({ user, onRegisterGuest }) => {
    return user ? (
        <div className="container h2">Welcome again, {user.username}!</div>
    ) : (
        <div className="container">
            <div className="jumbotron text-center mt-5 p-5">
                <h1 className="display-4">Everything is OK!</h1>
                <p className="lead">Share your concerns and find out why you shouldn't be worrying.</p>
                <hr className="my-4" />
                <p className="lead">
                    <button className="btn btn-success btn-lg mx-2" onClick={() => { window.location.href = "/register" }}>Register</button>
                    <button className="btn btn-primary btn-lg mx-2" onClick={() => { window.location.href = "/login" }}>Login</button>
                    <button className="btn btn-secondary btn-lg mx-2" onClick={() => { onRegisterGuest() }}>Continue as Guest</button>
                </p>
            </div>
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
            await axios.post(URL+"/register-guest", {}, { withCredentials: true });
            setUser({guest: true});
            window.location.href = "/";
        } catch (error) {
            setLoading(false);
        }
    }

    if(loading) {
        return <div>loading...</div>
    }

    return (
        <Router>
            <Navbar user={user} />
            <Routes>
                <Route path="/" element={<InitComponent user={user} onRegisterGuest={RegisterGuest} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile user={user} />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
