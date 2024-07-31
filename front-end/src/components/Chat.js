import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Chat = ({ Chat, LoadChats }) => {
    const [message, setMessage] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [chatOverflow, setChatOverflow] = useState("scroll");
    const [chat, setChat] = useState(Chat || { title: "", messages: [] });
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState(false);


    useEffect(() => {
        if(Chat) {
            setChat(Chat);
        }
    }, [Chat]);

    useEffect(() => {
        if(chat.id) {
            setId(chat.id);
        }

        if(chat.messages.length == 3 && !chat.title) {
            setTitle();
        }
    }, [chat]);

    const handleSend = async () => {
        if(loadingMsg) {
            return;
        }

        setMessage("");

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

    const setTitle = async () => {
        let message = "";
        if(chat.messages[1].content) {
            message = chat.messages[1].content;
        } else {
            console.log(chat);
            return;
        }

        try {
            let message = chat.messages[1].content;
            const response = await axios.post(URL+"/chat/title", {
                id,
                message
            }, { withCredentials: true });

            setLoadingTitle(false);
            setChat({title: response.data.title.substring(1, response.data.title.length-1), messages: chat.messages});
            LoadChats();
        } catch(error) {
            setLoadingTitle(false);
        }
    }

    const sendMessage = async (chatId) => {
        try {
            setChat({title: chat.title ? chat.title : "New Chat", messages: [...chat.messages, {role: "user", content: message}]});
            setLoadingMsg(true);
            if(!chat.title)
            setLoadingTitle(true);

            const sendMessageResponse = await axios.post(URL + "/chat/send", {
                chatId,
                message,
            }, { withCredentials: true });

            if(sendMessageResponse.data) {
                const newChat = {
                    title: chat.title,
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            setMessage((prev) => prev.substring(0, start) + '\t' + prev.substring(end));
            setTimeout(() => {
                inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 1;
            }, 0);
        }
    };
    
    useEffect(() => {
        if (inputRef.current) {
            const lineHeight = parseFloat(getComputedStyle(inputRef.current).lineHeight);
            const maxLines = 9;
            const maxHeight = lineHeight * maxLines;
        
            inputRef.current.style.height = 'auto';
            inputRef.current.style.overflowY = inputRef.current.scrollHeight > maxHeight ? 'auto' : 'hidden';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, maxHeight)}px`;
        }
    }, [message]);

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
                {!loadingTitle ? (
                    <h3>{(chat && chat.title) ? chat.title : ""}</h3>
                ) : (
                    <div className="spinner-border text-center mx-auto" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
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
                    <textarea
                        ref={inputRef}
                        className="form-control bg-body-tertiary border-0 no-focus-highlight"
                        placeholder="Write your concern"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        style={{ overflowY: 'hidden', resize: 'none' }}>
                    </textarea>
                        <div title="Send" className="align-content-center bg-body-tertiary rounded-end" style={{minHeight: "100%", minWidth: "36px"}}>
                            <div className="input-group-append" style={{width: "30px", height: "30px"}}>
                                <button className="btn btn-dark border-0 p-0 w-100 h-100" style={{borderRadius: "50%", transform: "translateX(2px)"}} onClick={handleSend}>
                                    <svg width="20" height="20" fill="currentColor" style={{transform: "translateY(-2px)"}} viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;