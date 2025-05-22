import React, { useState } from "react";
import { Bell } from "lucide-react";

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  // Placeholder notifications
  const notifications = [
    { id: 1, message: "2 pending verifications" },
    { id: 2, message: "1 flagged issue" },
  ];
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
            {notifications.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md z-10">
          <ul>
            {notifications.map(n => (
              <li key={n.id} className="p-2 border-b last:border-b-0 text-sm">
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
