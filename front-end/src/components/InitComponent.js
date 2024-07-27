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
            {sidebar && <Sidebar setSidebar={() => setSidebar(!sidebar)} NewChat={NewChat} concerns={concerns} changeChatId={changeChatId} usingId={chatId} />}
            <Chat Chat={chat} />
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