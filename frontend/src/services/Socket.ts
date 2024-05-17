import { io, Socket } from "socket.io-client";

if (!process.env.REACT_APP_HOST) {
    throw new Error("REACT_APP_HOST does not exist");
}

const SOCKET_URL: string = process.env.REACT_APP_HOST;

class SocketService {
    public socket: Socket;
    public messages: string[] = [];

    constructor() {
        const token = localStorage.getItem('token');
    
        this.socket = io(SOCKET_URL, {
            query: {
                token: token || ""
            }
        });
        
        this.socket.on("receive_message", this.receiveMessage.bind(this));
    }

    public sendMessage(data: { message: string; room?: string }) {
        if (data.room) {
            this.socket.emit("send_message", { message: data.message, room: data.room });
        } else {
            this.socket.emit("send_message", { message: data.message });
        }
    }

    public joinRoom(room: string) {
        this.socket.emit("join_room", room);
        localStorage.setItem("currentRoom", room);
    }

    public leaveRoom(room: string) {
        this.socket.emit("leave_room", room);
        localStorage.removeItem("currentRoom");
    }

    public getCurrentRoom(): string | null {
        return localStorage.getItem("currentRoom");
    }

    public receiveMessage(data: any) {
        this.messages.push(data.message);
    }
}

export default new SocketService();
