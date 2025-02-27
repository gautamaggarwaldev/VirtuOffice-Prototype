import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, children }) => {
  return (
    <div
      className={`w-80 bg-white border-l border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {children}
    </div>
  );
};

export default Sidebar;