import { useState } from 'react';
import socketService from '../services/Socket';
const MessageSender = () => {
    const [message, setMessage] = useState<string>('');
    const [room, setRoom] = useState<number | undefined>(undefined);

    const sendMessage = () => {
        if (message.trim() !== '') {
            socketService.sendMessage({ message, room });
            setMessage('');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <input
                type="number"
                placeholder="Room"
                value={room !== undefined ? room : ''}
                onChange={(e) => setRoom(e.target.value ? parseInt(e.target.value) : undefined)}
            />
            <button onClick={sendMessage}>Send Message</button>
        </div>
    );
};

export default MessageSender;
