import React, { useEffect, useState } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Concern = ({ concern, changeChatId, usingId, setId }) => {
    const openConcern = () => {
        changeChatId(concern.id);
    }

    return (
        <div className="row" style={{width: "225px"}}>
            <button onClick={() => {openConcern()}} className={`btn ${usingId === concern.id ? "btn-secondary" : "btn-dark"} col-10 bg-opacity-50 overflow-hidden text-start text-truncate my-2`}>
                {concern.title ? concern.title.substring(1, concern.title.length-1) : "New Chat"}
            </button>
            <button className="btn border-0 col-2 p-0" onClick={() => {setId(concern.id)}} data-bs-toggle="modal" data-bs-target="#delete">
                <svg className="p-0" width="16" height="16" fill="#dc3545" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </button>
        </div>
    );
}

const Sidebar = ({ concerns, changeChatId, usingId, loading }) => {
    const [deleteId, setId] = useState(null);
    const [visible, setVisible] = useState("visible")

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 800) {
                setVisible("hidden");
            } else {
                setVisible("visible");
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const NewChat = () => {
        window.location.href = "/";
    }

    const Delete = async () => {
        try {
            const response = await axios.delete(URL+"/chat/delete", {
                params: { chatId: deleteId },
                withCredentials: true
            });

            if(response.data.success) {
                window.location.href = "/";
            }
        } catch(err) {}
    }

    return (
        <div className="d-flex flex-column bg-dark-subtle text-light vh-auto smooth" style={{ width: (visible == "visible") ? "250px" : "0px", visibility: visible }}>
            <div className={`row m-0 smooth ${visible == "visible" ? "justify-content-between" : "justify-content-start"} align-items-center`} style={{width: "250px", visibility: "visible"}}>
                <button className="btn p-2 col-auto border-0 no-highlight" style={{width: "41px", height: "41px"}} onClick={() => setVisible(visible == "hidden" ? "visible" : "hidden")}>
                    <svg width="25px" height="25px" style={{transform: "translateY(-2px)"}} fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                        <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v2H1V3a1 1 0 0 1 1-1zM1 13V6h4v8H2a1 1 0 0 1-1-1m5 1V6h9v7a1 1 0 0 1-1 1z"/>
                    </svg>
                </button>

                <button className="btn p-2 col-auto border-0 no-highlight smooth" style={{width: "41px", height: "41px"}} onClick={() => NewChat()}>
                    <svg width="25px" height="25px" style={{transform: "translateY(-2px)"}} fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
            </div>

            <div className="flex-grow-1 overflow-x-hidden pb-2 ps-4 pe-2 p-0" style={{overflow: (visible == "visible") ? "auto" : "hidden"}}>
                <div className="h5 mt-2">History</div>
                {!loading ? 
                    ((concerns && concerns.length != 0) ? (
                        (concerns.map(concern => (
                            <Concern key={concern.id} concern={concern} changeChatId={changeChatId} usingId={usingId} setId={setId} />
                        )))
                    )
                    : (<p className="text-center text-body-tertiary">No concerns</p>)
                    ) : (
                        <div className="w-100 text-center">
                            <div className="spinner-border text-center mx-auto" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                }
            </div>

            <div className="modal fade" id="delete" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Warning!</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" onClick={() => {Delete(deleteId)}}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;