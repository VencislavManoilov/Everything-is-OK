import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const InitComponent = ({ user, onRegisterGuest }) => {
    const [sidebar, setSidebar] = useState(true);
    const [concerns, setConcerns] = useState(null);
    const [buttonsY, setButtonsY] = useState("71px");
    const [chatId, setChatId] = useState(null);
    const [chat, setChat] = useState(null);

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await axios.get(URL+"/chat/getIds", { withCredentials: true });
    
                setConcerns(response.data);
            } catch (error) {
                setConcerns(false);
            }
        }

        const navbar = document.getElementById("navbar");
        if(navbar) {
            setButtonsY(navbar.offsetHeight);
        }

        getChats();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 800) {
                setSidebar(false);
            } else {
                setSidebar(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const getChat = async () => {
            try {
                const response = await axios.get(URL+"/chat/get", { 
                    params: { id: chatId },
                    withCredentials: true
                });

                response.data.concern.messages = JSON.parse(response.data.concern.messages);
                response.data.concern.title = JSON.parse(response.data.concern.title);

                setChat(response.data.concern);
            } catch(error) {
                setChat(null);
            }
        }

        if(chatId) {
            getChat();
        }
    }, [chatId]);

    const NewChat = () => {
        if(chatId) {
            window.location.href = "/";
        }
    }

    const changeChatId = (id) => {
        setChatId(id);
    }

    return user ? (
        <div className="d-flex justify-content-start vh-100" style={{paddingBottom: "52px"}}>
            {sidebar && <Sidebar concerns={concerns} changeChatId={changeChatId} usingId={chatId} />}
            <Chat Chat={chat} />

            <div className="row justify-content-between" style={{zIndex: "1", position: "absolute", top: {buttonsY}, left: "13px", width: (sidebar ? "250px" : "108px")}}>
                <button className="btn  mx-2 col-auto" style={{transform: "scale(1.5)"}} onClick={() => {setSidebar(!sidebar)}}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                        <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v2H1V3a1 1 0 0 1 1-1zM1 13V6h4v8H2a1 1 0 0 1-1-1m5 1V6h9v7a1 1 0 0 1-1 1z"/>
                    </svg>
                </button>

                <button onClick={() => {NewChat()}} className="btn me-2 col-auto" style={{transform: "scale(1.5)"}}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
            </div>
        </div>
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
};

export default InitComponent;