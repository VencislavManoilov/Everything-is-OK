import React from "react";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Concern = ({ concern, changeChatId, usingId }) => {
    const openConcern = () => {
        changeChatId(concern.id);
    }

    return (
        <button onClick={() => {openConcern()}} className={`btn ${usingId === concern.id ? "btn-secondary" : "btn-dark"} bg-opacity-50 overflow-hidden text-start text-truncate w-100 my-2`}>
            {concern.title ? concern.title.substring(1, concern.title.length-1) : "New Chat"}
        </button>
    );
}

const Sidebar = ({ concerns, changeChatId, usingId }) => {
    return (
        <div className="d-flex flex-column bg-dark-subtle text-light p-3 vh-auto" style={{ width: '250px' }}>
            <div className="flex-grow-1 overflow-auto mt-5">
                {concerns ?
                    (concerns.map(concern => (
                        <Concern key={concern.id} concern={concern} changeChatId={changeChatId} usingId={usingId} />
                    )))
                : <p className="text-center">No concerns</p>
                }
            </div>
        </div>
    );
}

export default Sidebar;