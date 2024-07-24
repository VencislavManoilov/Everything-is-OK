import React, { useEffect, useState } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Chat = ({ chat }) => {
    const [message, setMessage] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(false);
    const [inputClass, setInputClass] = useState("fixed-bottom col-6")

    useEffect(() => {
        if(chat) {
            setId(chat.id);
        }
    })

    const handleSend = async () => {
        if(message.trim()) {
            if(!id) {
                try {
                    const createChat = await axios.post(URL+"/chat/create", {}, { withCredentials: true });

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
            const sendMessage = await axios.post(URL+"/chat/send", {
                chatId: id,
                message: message
            }, { withCredentials: true });

            if(sendMessage.data.success) {
                if(sendMessage.data.title) {
                    chat.title = sendMessage.data.title;
                }
                chat.messages = sendMessage.data.chat;
            }
        } catch(err) {
            setError("Error: " + err.response.data.error);
        }
    }

    return (
        <div className="mt-5 w-100">
            <div
            className="container"
            style={{
                maxWidth: "800px",
                minHeight: "max-content"
            }}
            >
                {error &&
                <div className="alert alert-danger alert-dismissible">
                    <div dangerouslySetInnerHTML={{ __html: error }}></div>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}

                <div className="row">
                    <h3>{(chat && chat.title) ? chat.title : "New Chat"}</h3>
                </div>
                
                <div className="row" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {(chat) &&
                        (chat.messages.map((msg, index) => (msg.role != 'system' &&
                            <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                                <div className={`d-inline-block p-2 ${msg.role === 'user' ? 'bg-secondary text-white' : 'text-ligth'}`} style={{ borderRadius: '10px' }}>
                                    {msg.content}
                                </div>
                            </div>
                        )))
                    }
                </div>

                <div className="row p-3">
                    <div className="input-group">
                        <input
                        type="text"
                        className="form-control bg-body-tertiary border-0"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{marginTop: "0px"}}
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