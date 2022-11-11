import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';

const ChatPage = () => {
    const [chats, setChats] = useState([]);
    useEffect(() => {
        fetchChats();
    }, [])
    // Data fetching from backend
     const fetchChats = async () => {
         const { data } = await axios.get("/api/chat");
         setChats(data);
    }
  
    return (
        <div>
            {/* For each child in a list should have a unique "key" prop.*/}
            {chats.map((chat) => ( <div key={chat._id}>{chat.chatName}</div>
            ))}
            </div>
  )
}

export default ChatPage