import React from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Profile = ({ user }) => {
    const isGuest = user.guest ? true : false;

    const logout = async () => {
        try {
            await axios.post(URL+"/logout", {}, { withCredentials: true });
            window.location.href = "/";
        } catch(err) {
            alert("Error:", err);
        }
    }

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
                                </>
                            )}
                            {isGuest && (
                                <p>Welcome, guest! You are currently logged in as a guest user.</p>
                            )}
                            <div className="mt-3">
                                {isGuest ? (
                                <>
                                    <button className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#modalRegister">Register</button>
                                    <button className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#modalLogin">Login</button>
                                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalGuestLogout">Logout</button>
                                </>
                                ) : (
                                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalLogout">Logout</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalRegister" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Have in mind!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Registerin will transfer the data to your new account.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-success" onClick={() => {window.location.href = "/register"}}>Register</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalLogin" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Warning!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Logging in will delete your current guest data.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => {window.location.href = "/login"}}>Login</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalGuestLogout" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Warning!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Logging out will delete your current guest data.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalLogout" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Warning!</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;