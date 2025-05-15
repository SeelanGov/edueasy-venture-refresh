import React from "react";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AdminButton: React.FC<AdminButtonProps> = ({ children, className = "", ...props }) => (
  <button
    className={`bg-admin hover:bg-admin-hover active:bg-admin-active text-admin-foreground font-semibold rounded-lg px-5 py-2 shadow-soft transition-colors duration-150 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default AdminButton;
