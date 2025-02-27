import React, { useState, useEffect, useCallback } from 'react';
import { Video, Users, MessageSquare, Settings, LogOut } from 'lucide-react';
import Character from './components/Character';
import ChatBox from './components/ChatBox';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import UserList from './components/UserList';
import VideoCall from './components/VideoCall';
import useStore from './store/useStore';
import socket from './services/socket';

function App() {
  const { 
    currentUser, 
    otherUsers, 
    messages, 
    isChatOpen, 
    isUserListOpen, 
    isVideoCallOpen,
    videoCall,
    setCurrentUser, 
    updatePosition, 
    addMessage, 
    toggleChat, 
    toggleUserList, 
    toggleVideoCall,
    startVideoCall,
    logout
  } = useStore();
  
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('yellow');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!currentUser) return;
    
    const step = 5;
    const newPosition = { ...currentUser.position };

    switch (e.key) {
      case 'ArrowUp':
        newPosition.y = Math.max(0, newPosition.y - step);
        break;
      case 'ArrowDown':
        newPosition.y = Math.min(95, newPosition.y + step);
        break;
      case 'ArrowLeft':
        newPosition.x = Math.max(0, newPosition.x - step);
        break;
      case 'ArrowRight':
        newPosition.x = Math.min(95, newPosition.x + step);
        break;
      default:
        return;
    }

    updatePosition(newPosition);
  }, [currentUser, updatePosition]);

  useEffect(() => {
    if (currentUser) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentUser({ name: username, avatar });
    }
  };

  const handleStartCall = (userId: number) => {
    startVideoCall([userId]);
    toggleVideoCall();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Virtual Space</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Avatar
              </label>
              <div className="flex flex-wrap justify-center gap-3">
                {['yellow', 'blue', 'green', 'red', 'purple', 'orange', 'pink', 'cyan'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-12 h-12 rounded-full ${
                      avatar === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                    } transition-all hover:scale-110 overflow-hidden`}
                    onClick={() => setAvatar(color)}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${color}&backgroundColor=${color}`}
                      alt={`${color} avatar`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Enter Space
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Virtual Space</h1>
        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white ${
              isVideoCallOpen || videoCall.active ? 'bg-green-500' : ''
            }`}
            onClick={toggleVideoCall}
            title="Video Call"
          >
            <Video size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white ${
              isUserListOpen ? 'bg-indigo-700' : ''
            }`}
            onClick={toggleUserList}
            title="User List"
          >
            <Users size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white ${
              isChatOpen ? 'bg-indigo-700' : ''
            }`}
            onClick={toggleChat}
            title="Chat"
          >
            <MessageSquare size={20} />
          </button>
          <button
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <button
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={logout}
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
          <div className="flex items-center ml-2">
            <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
              <img 
                src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${currentUser.name}&backgroundColor=${currentUser.avatar}`}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium">{currentUser.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Map Area */}
        <div className="flex-1 relative overflow-hidden">
          <Map />
          
          {/* User Character */}
          <Character 
            position={currentUser.position} 
            color={currentUser.avatar} 
            isCurrentUser={true} 
            name={currentUser.name} 
          />
          
          {/* Other Users */}
          {otherUsers.map((user) => (
            <Character
              key={user.id}
              position={user.position}
              color={user.avatar}
              isCurrentUser={false}
              name={user.name}
            />
          ))}
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
            <p className="text-sm font-medium">Use arrow keys to move around</p>
          </div>
        </div>

        {/* Sidebar for Chat or User List */}
        <Sidebar isOpen={isChatOpen || isUserListOpen}>
          {isChatOpen && (
            <ChatBox
              messages={messages}
              onSendMessage={addMessage}
              username={currentUser.name}
            />
          )}
          {isUserListOpen && (
            <UserList
              users={[
                { ...currentUser, isCurrentUser: true },
                ...otherUsers,
              ]}
              onStartCall={handleStartCall}
            />
          )}
        </Sidebar>
      </div>
      
      {/* Video Call Modal */}
      {isVideoCallOpen && videoCall.active && (
        <VideoCall onClose={toggleVideoCall} />
      )}
    </div>
  );
}

export default App;