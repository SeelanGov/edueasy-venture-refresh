import React from 'react';

// Using type instead of empty interface
type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AdminButton: React.FC<AdminButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${props.className}`}
    >
      {children}
    </button>
  );
};

export default AdminButton;
