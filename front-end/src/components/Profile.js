import React from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Profile = ({ user }) => {
    const isGuest = user.guest;

    const handleRegister = () => {
        window.location.href = "/register";
    };

    const handleLogin = () => {
        window.location.href = "/login";
    };

    const handleLogout = async () => {
        try {
            await axios.post(URL+"/logout", {}, { withCredentials: true });
            window.location.href = "/";
        } catch(err) {

        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h2>Profile Page</h2>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <h4>{isGuest ? "Guest User" : user.username}</h4>
                            {!isGuest && (
                                <>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Username:</strong> {user.username}</p>
                                </>
                            )}
                            {isGuest && (
                                <p>Welcome, guest! You are currently logged in as a guest user.</p>
                            )}
                            <div className="mt-3">
                                {isGuest ? (
                                <>
                                    <button className="btn btn-success me-2" onClick={handleRegister}>Register</button>
                                    <button className="btn btn-primary me-2" onClick={handleLogin}>Login</button>
                                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">Logout</button>
                                </>
                                ) : (
                                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Are you sure you want to logout?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>The data will be deleted</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={() => {handleLogout()}}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;