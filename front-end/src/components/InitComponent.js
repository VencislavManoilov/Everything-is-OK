import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import FAQ from "./FAQ";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const InitComponent = ({ user, onRegisterGuest }) => {
    const [concerns, setConcerns] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [chat, setChat] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [loadingIds, setLoadingIds] = useState(false);

    const LoadChats = async () => {
        if(user) {
            try {
                setLoadingIds(true);
                const response = await axios.get(URL+"/chat/getIds", { withCredentials: true });
    
                setConcerns(response.data);
                setLoadingIds(false);
            } catch (error) {
                setConcerns(false);
            }
        }
    }

    useEffect(() => {
        LoadChats();
    }, []);

    useEffect(() => {
        const getChat = async () => {
            try {
                setLoadingChat(true);
                const response = await axios.get(URL+"/chat/get", { 
                    params: { id: chatId },
                    withCredentials: true
                });

                setLoadingChat(false);

                response.data.concern.messages = JSON.parse(response.data.concern.messages);
                response.data.concern.title = response.data.concern.title;

                setChat(response.data.concern);
            } catch(error) {
                setChat(null);
                setLoadingChat(false);
            }
        }

        if(chatId) {
            getChat();
        }
    }, [chatId]);

    const changeChatId = (id) => {
        setChatId(id);
    }

    return user ? (
        <div className="d-flex justify-content-start vh-100" style={{paddingBottom: "52px"}}>
            <Sidebar concerns={concerns} changeChatId={changeChatId} usingId={chatId} loading={loadingIds} />

            {!loadingChat ? (
                <Chat Chat={chat} LoadChats={LoadChats} />
            ) : (
                <div className="w-100 h-100 text-center align-content-center">
                    <div className="spinner-border text-center mx-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
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
                <FAQ />
            </div>
        </div>
    )
};

export default InitComponent;