import { io, Socket } from "socket.io-client";

if (!process.env.REACT_APP_HOST) {
    throw new Error("REACT_APP_HOST does not exist");
}

const SOCKET_URL: string = process.env.REACT_APP_HOST;

class SocketService {
    public socket: Socket;
    constructor() {
        this.socket = io(SOCKET_URL);
    }

    public joinRoom(room: number, userId: string, username: string) {
        this.socket.emit("join_room", { room, userId, username });
    }

    public listenOnRoom(room: string, callback: any) {
        this.socket.on(room, callback)
    }

    public disconnectedFromRoom(room: string, callback: any) {
        this.socket.off(room, callback)
    }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;
