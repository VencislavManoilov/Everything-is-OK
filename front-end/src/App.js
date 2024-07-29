import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import axios from "axios";
import InitComponent from "./components/InitComponent";
import FAQ from "./components/FAQ";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Error from "./components/Error";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

function App() {
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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
            setError(true);
        }
    }

    if(loading) {
        return <div>loading...</div>
    }

    return (
        (!error ? (
            <Router>
                <Navbar user={user} />
                <Routes>
                    <Route path="/" element={<InitComponent user={user} onRegisterGuest={RegisterGuest} />} />
                    <Route path="/FAQ" element={<FAQ />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile user={user} />} />
                </Routes>
                {/* <Footer /> */}
            </Router>
        ) : (
            <Error />
        ))
    );
}

export default App;