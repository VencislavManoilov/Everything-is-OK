import React from 'react';

const Error = () => {
    const handleRetry = () => {
        // Logic for retrying the action that caused the error
        window.location.reload();
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center error-page">
            <dic className="row">
                <div className="col">
                    <h1 className="display-3 text-danger">Oops!</h1>
                    <h2 className="mb-4" style={{fontSize: "2.5rem"}}>Something went wrong</h2>
                    <p className="mb-5 h4 fw-normal">We encountered an error while processing your request. Please try again later.</p>
                    <button type="button" className="btn btn-outline-secondary" onClick={handleRetry}>Retry</button>
                </div>
            </dic>
        </div>
    );
};

export default Error;