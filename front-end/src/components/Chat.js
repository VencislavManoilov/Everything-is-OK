import React, { useEffect, useState } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_CUSTOM_BACKEND_URL || "http://localhost:8080";

const Chat = ({ chat }) => {
    const [message, setMessage] = useState("");
    const [id, setId] = useState(null);
    const [error, setError] = useState(false);

    chat = {
        id: 13,
        title: "Casual Catch-Up: What's on your mind",
        messages: [{"role":"system","content":"You are a helpful and calming assistant. A user just shared a concern with you. Your job is to reassure them by explaining why their concern is not scary and how everything is ok"},{"role":"user","content":"What's up!"},{"role":"assistant","content":"Hello! I’m here to help you with anything on your mind. If you have a concern or something you’d like to talk about, feel free to share. There's no need to worry; I'm here to reassure you and provide support!"},{"role":"user","content":"I don't know. Can you ask me questions that when I answer you tell me what's wrong? "},{"role":"assistant","content":"Of course! Let’s try to figure things out together. I’ll ask a few questions, and you can share your thoughts. Here we go:\n\n1. What’s been on your mind lately? \n2. Are there any specific situations or feelings that have been bothering you?\n3. When did you start feeling this way, if you can remember?\n4. Have there been any changes in your routine or life recently?\n\nFeel free to answer any or all of these, and we’ll take it from there. Remember, it’s completely okay to share!"}]
    }

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
                    console.log(sendMessage.data.title, sendMessage.data.chat);
                } else {
                    console.log(sendMessage.data.chat);
                }
                chat.messages = sendMessage.data.chat;
            }
        } catch(err) {
            setError("Error: " + err.response.data.error);
        }
    }

    return (
        <div className="container mt-5">
            <div className="card">
                {error &&
                <div className="alert alert-danger alert-dismissible">
                    <div dangerouslySetInnerHTML={{ __html: error }}></div>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}

                <div className="card-header">
                    <h3>{chat.title ? chat.title : "New Chat"}</h3>
                </div>
                
                {chat &&
                <div className="card-body chat-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {chat.messages.map((msg, index) => (msg.role != 'system' &&
                        <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                            <div className={`d-inline-block p-2 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-ligth'}`} style={{ borderRadius: '10px' }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>}

                <div className="card-footer">
                    <div className="input-group">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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