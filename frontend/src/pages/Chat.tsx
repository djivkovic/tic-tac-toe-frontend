import React, { useState } from 'react';
import socketService from '../services/Socket';

const MessageSender = () => {
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState('');

    const sendMessage = () => {
        if (message.trim() !== '') {
            socketService.sendMessage({ message, room });
            setMessage('');
        }
    };

    return (
        <div>
            <input type="text" placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
            <input type="text" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
};

export default MessageSender;
