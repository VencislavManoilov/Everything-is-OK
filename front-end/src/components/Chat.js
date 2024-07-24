import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Chat = ({ chat }) => {
    const [message, setMessage] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(false);
    const messagesEndRef = useRef(null);
    const [chatOverflow, setChatOverflow] = useState("hidden");

    useEffect(() => {
        if(chat) {
            setId(chat.id);
        }
    }, [chat]);

    const handleSend = async () => {
        if(message.trim()) {
            if(!id) {
                try {
                    const createChat = await axios.post(URL + "/chat/create", {}, { withCredentials: true });

                    if(createChat.data.success) {
                        const newId = createChat.data.id;
                        setId(createChat.data.id);

                        sendMessage(newId);
                    }
                } catch(err) {
                    setError("Error: " + err.response.data.error);
                }
            } else {
                sendMessage(id);
            }
        }
    };

    const sendMessage = async (id) => {
        try {
            const sendMessage = await axios.post(URL + "/chat/send", {
                chatId: id,
                message: message
            }, { withCredentials: true });

            if(sendMessage.data.success) {
                if(sendMessage.data.title) {
                    chat.title = sendMessage.data.title;
                }
                chat.messages = sendMessage.data.chat;
                setMessage(""); // Clear input after sending
                scrollToBottom(); // Scroll to bottom
            }
        } catch(err) {
            setError("Error: " + err.response.data.error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    };

    useEffect(() => {
        scrollToBottom();
        // window.scrollTo(0, 0);
    }, [chat?.messages]);

    useEffect(() => {
        const handleResize = () => {
            if(document.getElementById("chat")?.offsetHeight > window.innerHeight - 56 - 90 - 54) {
                console.log("Hello")
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
    }, [document.getElementById("chat")?.offsetHeight]);

    return (
        <div className="w-100 container h-100 d-flex flex-column" style={{ padding: "0", minWidth: "calc(100% - 250px)" }}>
            {error &&
                <div className="alert alert-danger alert-dismissible">
                    <div dangerouslySetInnerHTML={{ __html: error }}></div>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }

            <div className="text-center pt-5 pb-2 px-2">
                <h3>{(chat && chat.title) ? chat.title : "New Chat"}</h3>
            </div>

            <div id="chat" className="flex-grow-1 w-100 px-3" style={{ overflowY: {chatOverflow}, overflowX: "hidden" }}>
                <div className="row justify-content-center">
                    <div className="col" style={{ maxWidth: "800px" }}>
                        {chat && chat.messages.map((msg, index) => (
                            msg.role !== 'system' && (
                                <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                                    <div className={`d-inline-block p-2 ${msg.role === 'user' ? 'bg-secondary text-white text-start' : 'text-light'}`} style={{ borderRadius: '10px', maxWidth: (msg.role === "user" ? "60%" : "none") }}>
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
                <div ref={messagesEndRef}></div>
            </div>

            <div className="row justify-content-center">
                <div className="col" style={{ maxWidth: "800px" }}>
                    <div className="input-group mb-3 px-3">
                        <input
                            type="text"
                            className="form-control bg-body-tertiary border-0"
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{border: "none"}}
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