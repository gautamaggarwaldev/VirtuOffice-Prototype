import React from 'react';
import { Video, Mic, MicOff, Phone } from 'lucide-react';
import useStore from '../store/useStore';

interface User {
  id: number;
  name: string;
  avatar: string;
  isCurrentUser?: boolean;
  inCall?: boolean;
}

interface UserListProps {
  users: User[];
  onStartCall: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onStartCall }) => {
  const { videoCall } = useStore();
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Users in Space</h2>
        <p className="text-sm text-gray-500">{users.length} online</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-2">
          {users.map((user) => {
            const isInCall = videoCall.participants.includes(user.id) || user.inCall;
            
            return (
              <li
                key={user.id}
                className={`p-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-indigo-50' : 'hover:bg-gray-50'
                } ${isInCall ? 'border border-green-500' : ''}`}
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                    style={{ backgroundColor: user.avatar }}
                  >
                    <span className="text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {user.name} {user.isCurrentUser && '(You)'}
                      </span>
                      <div className="flex space-x-2">
                        {!user.isCurrentUser && (
                          <button 
                            className={`p-1 rounded-full ${isInCall ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-indigo-600'}`}
                            onClick={() => onStartCall(user.id)}
                            disabled={isInCall}
                            title={isInCall ? "User is in a call" : "Start video call"}
                          >
                            {isInCall ? <Phone size={16} /> : <Video size={16} />}
                          </button>
                        )}
                        <button className="p-1 rounded-full text-gray-400 hover:text-indigo-600">
                          {Math.random() > 0.5 ? <Mic size={16} /> : <MicOff size={16} />}
                        </button>
                      </div>
                    </div>
                    {isInCall && (
                      <div className="text-xs text-green-600 mt-1">
                        In a video call
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserList;