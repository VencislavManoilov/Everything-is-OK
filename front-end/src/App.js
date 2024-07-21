import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const InitComponent = ({ user }) => {
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
        <div>Hello World</div>
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

    if(loading) {
        return <div>loading...</div>
    }

    return (
        <Router>
            <Routes>
                <Route path='/' element={<InitComponent user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;
