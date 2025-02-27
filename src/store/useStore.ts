import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import socket from '../services/socket';

interface Position {
  x: number;
  y: number;
}

interface User {
  id: number;
  socketId?: string;
  name: string;
  position: Position;
  avatar: string;
  inCall?: boolean;
}

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
}

interface VideoCall {
  active: boolean;
  participants: number[];
  streams: Record<string, MediaStream>;
  peers: Record<string, any>;
}

interface AppState {
  currentUser: User | null;
  otherUsers: User[];
  messages: Message[];
  videoCall: VideoCall;
  isChatOpen: boolean;
  isUserListOpen: boolean;
  isVideoCallOpen: boolean;
  
  setCurrentUser: (user: { name: string; avatar: string }) => void;
  updatePosition: (position: Position) => void;
  addMessage: (message: string) => void;
  toggleChat: () => void;
  toggleUserList: () => void;
  toggleVideoCall: () => void;
  startVideoCall: (participants: number[]) => void;
  endVideoCall: () => void;
  addUserToCall: (userId: number) => void;
  removeUserFromCall: (userId: number) => void;
  addPeer: (userId: string, peer: any) => void;
  removePeer: (userId: string) => void;
  addStream: (userId: string, stream: MediaStream) => void;
  removeStream: (userId: string) => void;
  logout: () => void;
}

// Generate a unique ID for this session
const sessionId = uuidv4();

const useStore = create<AppState>((set, get) => {
  // Initialize socket connection and event listeners
  socket.on('user-joined', (data: { user: User }) => {
    set((state) => ({
      otherUsers: [...state.otherUsers, data.user]
    }));
  });

  socket.on('user-moved', (data: { userId: number; position: Position }) => {
    set((state) => ({
      otherUsers: state.otherUsers.map(user => 
        user.id === data.userId 
          ? { ...user, position: data.position } 
          : user
      )
    }));
  });

  socket.on('user-left', (data: { userId: number }) => {
    set((state) => ({
      otherUsers: state.otherUsers.filter(user => user.id !== data.userId)
    }));
  });

  socket.on('new-message', (data: { message: Message }) => {
    set((state) => ({
      messages: [...state.messages, data.message]
    }));
  });

  socket.on('call-user', (data: { from: string; signal: any }) => {
    // Handle incoming call
    console.log('Incoming call from', data.from);
  });

  socket.on('call-accepted', (data: { from: string; signal: any }) => {
    // Handle call acceptance
    console.log('Call accepted by', data.from);
  });

  return {
    currentUser: null,
    otherUsers: [
      { id: 1, name: 'Alice', position: { x: 30, y: 40 }, avatar: 'blue' },
      { id: 2, name: 'Bob', position: { x: 70, y: 60 }, avatar: 'green' },
      { id: 3, name: 'Charlie', position: { x: 90, y: 30 }, avatar: 'red' },
      { id: 4, name: 'Diana', position: { x: 20, y: 80 }, avatar: 'purple' },
      { id: 5, name: 'Ethan', position: { x: 60, y: 20 }, avatar: 'orange' },
    ],
    messages: [
      { id: 1, user: 'Alice', message: 'Hey everyone!', timestamp: new Date().toISOString() },
      { id: 2, user: 'Bob', message: 'Welcome to our virtual space!', timestamp: new Date().toISOString() },
    ],
    videoCall: {
      active: false,
      participants: [],
      streams: {},
      peers: {}
    },
    isChatOpen: false,
    isUserListOpen: false,
    isVideoCallOpen: false,
    
    setCurrentUser: (user) => {
      const newUser = {
        id: Math.floor(Math.random() * 10000),
        socketId: socket.id,
        name: user.name,
        position: { x: 50, y: 50 },
        avatar: user.avatar,
      };
      
      set({ currentUser: newUser });
      
      // Emit user joined event
      socket.emit('user-joined', { user: newUser });
    },
    
    updatePosition: (position) => {
      const currentUser = get().currentUser;
      
      if (!currentUser) return;
      
      set((state) => ({
        currentUser: {
          ...currentUser,
          position,
        }
      }));
      
      // Emit position update
      socket.emit('user-moved', { 
        userId: currentUser.id, 
        position 
      });
    },
    
    addMessage: (message) => {
      const currentUser = get().currentUser;
      
      if (!currentUser) return;
      
      const newMessage = {
        id: get().messages.length + 1,
        user: currentUser.name,
        message,
        timestamp: new Date().toISOString(),
      };
      
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
      
      // Emit new message
      socket.emit('new-message', { message: newMessage });
    },
    
    toggleChat: () => set((state) => ({
      isChatOpen: !state.isChatOpen,
      isUserListOpen: false,
    })),
    
    toggleUserList: () => set((state) => ({
      isUserListOpen: !state.isUserListOpen,
      isChatOpen: false,
    })),
    
    toggleVideoCall: () => set((state) => ({
      isVideoCallOpen: !state.isVideoCallOpen,
    })),
    
    startVideoCall: (participants) => {
      set({
        videoCall: {
          ...get().videoCall,
          active: true,
          participants,
        },
        isVideoCallOpen: true,
      });
      
      // Emit call start
      socket.emit('start-call', { participants });
    },
    
    endVideoCall: () => {
      const { peers, streams } = get().videoCall;
      
      // Close all peer connections
      Object.values(peers).forEach(peer => {
        if (peer && typeof peer.destroy === 'function') {
          peer.destroy();
        }
      });
      
      // Stop all media tracks
      Object.values(streams).forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
      
      set({
        videoCall: {
          active: false,
          participants: [],
          streams: {},
          peers: {}
        },
        isVideoCallOpen: false,
      });
      
      // Emit call end
      socket.emit('end-call');
    },
    
    addUserToCall: (userId) => set((state) => ({
      videoCall: {
        ...state.videoCall,
        participants: [...state.videoCall.participants, userId],
      },
    })),
    
    removeUserFromCall: (userId) => set((state) => ({
      videoCall: {
        ...state.videoCall,
        participants: state.videoCall.participants.filter(id => id !== userId),
      },
    })),
    
    addPeer: (userId, peer) => set((state) => ({
      videoCall: {
        ...state.videoCall,
        peers: {
          ...state.videoCall.peers,
          [userId]: peer
        }
      }
    })),
    
    removePeer: (userId) => {
      const { peers } = get().videoCall;
      
      if (peers[userId] && typeof peers[userId].destroy === 'function') {
        peers[userId].destroy();
      }
      
      const newPeers = { ...peers };
      delete newPeers[userId];
      
      set((state) => ({
        videoCall: {
          ...state.videoCall,
          peers: newPeers
        }
      }));
    },
    
    addStream: (userId, stream) => set((state) => ({
      videoCall: {
        ...state.videoCall,
        streams: {
          ...state.videoCall.streams,
          [userId]: stream
        }
      }
    })),
    
    removeStream: (userId) => {
      const { streams } = get().videoCall;
      
      if (streams[userId]) {
        streams[userId].getTracks().forEach(track => track.stop());
      }
      
      const newStreams = { ...streams };
      delete newStreams[userId];
      
      set((state) => ({
        videoCall: {
          ...state.videoCall,
          streams: newStreams
        }
      }));
    },
    
    logout: () => {
      const currentUser = get().currentUser;
      
      if (currentUser) {
        // Emit user left event
        socket.emit('user-left', { userId: currentUser.id });
      }
      
      // End any active calls
      const { active } = get().videoCall;
      if (active) {
        get().endVideoCall();
      }
      
      set({
        currentUser: null,
        isChatOpen: false,
        isUserListOpen: false,
        isVideoCallOpen: false,
      });
    },
  };
});

export default useStore;