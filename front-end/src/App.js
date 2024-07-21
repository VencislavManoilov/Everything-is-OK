import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const InitComponent = () => {
    return (
        <div>Hello World!</div>
    )
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<InitComponent />} />
            </Routes>
        </Router>
    );
}

export default App;
