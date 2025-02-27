 
import { v4 as uuidv4 } from "uuid";

type SocketEventHandler = (data: unknown) => void;

class MockSocket {
  private listeners: Record<string, SocketEventHandler[]> = {};
  private rooms: Record<string, Set<string>> = {};
  private clientId: string;
  private beforeUnloadListener: () => void;

  constructor() {
    this.clientId = uuidv4();

    if (typeof window !== "undefined" && !window.mockSocketRegistry) {
      window.mockSocketRegistry = {
        sockets: new Map(),
        broadcast: (event: string, data: unknown, senderId: string) => {
          window.mockSocketRegistry.sockets.forEach((socket, id) => {
            if (id !== senderId) {
              socket.receiveEvent(event, data);
            }
          });
        },
      };
    }

    window.mockSocketRegistry.sockets.set(this.clientId, this);

    // Handle tab close
    this.beforeUnloadListener = () => {
      window.mockSocketRegistry.sockets.delete(this.clientId);
      this.emit("user-disconnect", { userId: this.clientId });
    };
    window.addEventListener("beforeunload", this.beforeUnloadListener);
  }

  receiveEvent(event: string, data: unknown) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  on(event: string, callback: SocketEventHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  emit(event: string, data: unknown) {
    window.mockSocketRegistry.broadcast(event, data, this.clientId);
    return this;
  }

  join(room: string) {
    if (!room || typeof room !== "string") {
      console.error("Invalid room name");
      return this;
    }
    if (!this.rooms[room]) {
      this.rooms[room] = new Set();
    }
    this.rooms[room].add(this.clientId);
    return this;
  }

  leave(room: string) {
    if (this.rooms[room]) {
      this.rooms[room].delete(this.clientId);
      if (this.rooms[room].size === 0) {
        delete this.rooms[room];
      }
    }
    return this;
  }

  to(room: string) {
    return {
      emit: (event: string, data: unknown) => {
        if (this.rooms[room]) {
          this.rooms[room].forEach((clientId) => {
            if (
              clientId !== this.clientId &&
              window.mockSocketRegistry.sockets.has(clientId)
            ) {
              const socket = window.mockSocketRegistry.sockets.get(clientId);
              if (socket) {
                socket.receiveEvent(event, data);
              }
            }
          });
        }
      },
    };
  }

  disconnect() {
    window.mockSocketRegistry.sockets.delete(this.clientId);
    this.emit("user-disconnect", { userId: this.clientId });
    window.removeEventListener("beforeunload", this.beforeUnloadListener);
  }

  get id() {
    return this.clientId;
  }
}

declare global {
  interface Window {
    mockSocketRegistry: {
      sockets: Map<string, MockSocket>;
      broadcast: (event: string, data: unknown, senderId: string) => void;
    };
  }
}

const socket = new MockSocket();
export default socket;
export { MockSocket };
