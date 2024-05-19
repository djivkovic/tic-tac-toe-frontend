import { io, Socket } from "socket.io-client";

if (!process.env.REACT_APP_HOST) {
    throw new Error("REACT_APP_HOST does not exist");
}

const SOCKET_URL: string = process.env.REACT_APP_HOST;

class SocketService {
    public socket: Socket;
    public messages: string[] = [];
    public players: string[] = []; 
    constructor() {
        const token = localStorage.getItem('token');
    
        this.socket = io(SOCKET_URL, {
            query: {
                token: token || ""
            }
        });
        
        this.socket.on("receive_message", this.receiveMessage.bind(this));

        this.socket.on("update_players", (data: any) => {
            this.players = data.players;
        });
    }

    public sendMessage(data: { message: string; room?: number }) {
        if (data.room) {
            this.socket.emit("send_message", { message: data.message, room: data.room });
        } else {
            this.socket.emit("send_message", { message: data.message });
        }
    }

    public joinRoom(room: number, userId: string, username: string) {
        this.socket.emit("join_room", { room, userId, username });
    }

    public leaveRoom(room: number) {
        this.socket.emit("leave_room", room);
        localStorage.removeItem("currentRoom");
    }

    public receiveMessage(data: any) {
        this.messages.push(data.message);
    }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;
