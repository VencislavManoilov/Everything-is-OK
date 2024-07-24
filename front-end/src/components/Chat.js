import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Chat = ({ Chat, ID }) => {
    const [message, setMessage] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [chatOverflow, setChatOverflow] = useState("scroll");
    const [chat, setChat] = useState(Chat || { title: "", messages: [] });
    const [loaded, setLoaded] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(false);


    useEffect(() => {
        if(Chat) {
            setChat(Chat);
            setLoaded(true);
            console.log("Idk");
        }
    }, [Chat]);

    useEffect(() => {
        if(chat.id) {
            setId(chat.id);
        }
    }, [chat]);

    const handleSend = async () => {
        if(inputRef.current) {
            inputRef.current.value = "";
        }

        if(message.trim()) {
            if(!id) {
                try {
                    const createChat = await axios.post(URL + "/chat/create", {}, { withCredentials: true });

                    if(createChat.data.success) {
                        const newId = createChat.data.id;
                        setId(newId);

                        sendMessage(newId);
                        setMessage("");
                    }
                } catch(err) {
                    setError("Error: " + err.response.data.error);
                }
            } else {
                sendMessage(id);
            }
        }
    };

    const sendMessage = async (chatId) => {
        try {
            setChat({title: chat.title, messages: [...chat.messages, {role: "user", content: message}]});
            setLoadingMsg(true);

            const sendMessageResponse = await axios.post(URL + "/chat/send", {
                chatId,
                message,
            }, { withCredentials: true });

            if(sendMessageResponse.data) {
                const newChat = {
                    title: sendMessageResponse.data.title || chat.title,
                    messages: sendMessageResponse.data.chat,
                };

                setLoadingMsg(false);
                setChat(newChat);

                scrollToBottom();
            } else {
                setError("Unexpected response format");
            }
        } catch(err) {
            console.log(err);
            setError("Error: " + (err.response?.data?.error || "An unknown error occurred"));
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    useEffect(() => {
        const handleResize = () => {
            if(document.getElementById("messages")?.offsetHeight > window.innerHeight - 200) {
                setChatOverflow("scoll");
            } else {
                setChatOverflow("hidden");
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [document.getElementById("messages")?.offsetHeight]);

    return (
        <div className="w-100 container h-100 d-flex flex-column" style={{ padding: "0", minWidth: "calc(100% - 250px)" }}>
            {error &&
                <div className="alert alert-danger alert-dismissible">
                    <div dangerouslySetInnerHTML={{ __html: error }}></div>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }

            <div className="text-center pt-5 pb-2 px-2">
                <h3>{(chat && chat.title) ? chat.title : ""}</h3>
            </div>

            <div id="chat" className="flex-grow-1 w-100 px-3" style={{ overflowY: {chatOverflow}, overflowX: "hidden" }}>
                <div className="row justify-content-center">
                    <div id="messages" className="col" style={{ maxWidth: "800px" }}>
                        {chat?.messages.length > 0 ? (
                            chat.messages.map((msg, index) => (
                                msg.role !== 'system' && (
                                    <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                                        <div className={`d-inline-block p-2 ${msg.role === 'user' ? 'bg-secondary text-white text-start' : 'text-light'}`} style={{ borderRadius: '10px', whiteSpace: 'pre-wrap', maxWidth: (msg.role === "user" ? "60%" : "none") }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="text-center mt-5">
                                <h3 className="mb-3">Welcome!</h3>
                                <p>Feeling uneasy about something in the world? You're not alone. Share your concerns here, and we'll help you understand why it's not as scary as it seems.</p>
                                <p className="text-muted">Together, we can find calm in the midst of uncertainty.</p>
                            </div>
                        )}

                        <div className="row w-100 text-center" style={{ display: (loadingMsg ? "block" : "none") }}>
                            <div className="spinner-border mx-auto" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={messagesEndRef}></div>
            </div>

            <div className="row justify-content-center">
                <div className="col" style={{ maxWidth: "800px" }}>
                    <div className="input-group mb-3 px-3">
                        <input
                            ref={inputRef}
                            type="text"
                            className="form-control bg-body-tertiary border-0 no-focus-highlight"
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => {setMessage(e.target.value)}}
                            autoComplete="off"
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-primary" onClick={handleSend}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;