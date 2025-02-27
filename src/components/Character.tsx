import React from 'react';

interface CharacterProps {
  position: { x: number; y: number };
  color: string;
  isCurrentUser: boolean;
  name: string;
}

const Character: React.FC<CharacterProps> = ({ position, color, isCurrentUser, name }) => {
  // Map color names to avatar URLs
  const getAvatarUrl = (color: string) => {
    const avatarMap: Record<string, string> = {
      'yellow': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix&backgroundColor=ffbe0b',
      'blue': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lily&backgroundColor=3a86ff',
      'green': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Max&backgroundColor=38b000',
      'red': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Ruby&backgroundColor=ff006e',
      'purple': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Zoe&backgroundColor=8338ec',
      'orange': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Milo&backgroundColor=fb5607',
      'pink': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Luna&backgroundColor=ff70a6',
      'cyan': 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leo&backgroundColor=00b4d8',
    };
    
    return avatarMap[color] || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}`;
  };

  return (
    <div
      className={`absolute transition-all duration-200 ease-in-out ${
        isCurrentUser ? 'z-10' : 'z-5'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full ${
            isCurrentUser ? 'ring-2 ring-white ring-offset-1' : ''
          } overflow-hidden`}
        >
          <img 
            src={getAvatarUrl(color)} 
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-1 px-2 py-1 bg-white rounded-md shadow-sm text-xs font-medium">
          {name}
        </div>
      </div>
    </div>
  );
};

export default Character;