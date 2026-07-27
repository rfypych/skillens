'use client';

import { Notification, Search } from '@carbon/icons-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function Header() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      // ignore
    }
  };

  const markRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      // ignore
    }
  };
  return (
    <header className="h-16 border-b border-brand-gray-light bg-brand-white sticky top-0 z-10 px-6 flex items-center justify-between flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={14} className="text-brand-gray-dark" />
        </div>
        <input
          id="global-search"
          type="text"
          className="ink-input pl-9 pr-10 py-2 text-sm border border-brand-gray-light rounded-none focus:outline-none focus:ring-0 focus:border-brand-primary"
          placeholder="Search roles, candidates…"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd
            className="hidden sm:inline-block text-[10px] font-mono font-semibold text-brand-gray-dark border border-brand-gray-light rounded-none px-1 py-0.5 bg-brand-white"
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification bell */}
        <div className="relative">
          <button
            id="notification-bell"
            className="relative p-2 rounded-none hover:bg-brand-gray-light/20 transition-colors text-brand-gray-dark hover:text-brand-dark"
            aria-label="Notifications"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Notification size={16} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-none bg-brand-accent" />
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-brand-white border border-brand-gray-light shadow-lg z-50">
              <div className="p-3 border-b border-brand-gray-light font-bold text-sm text-brand-secondary">
                Notifications ({notifications.length})
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-xs text-brand-gray-dark text-center">No new notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className="p-3 border-b border-brand-gray-light/50 hover:bg-brand-gray-light/5 flex justify-between items-start gap-2">
                      <div className="text-xs text-brand-dark">{notif.message}</div>
                      <button onClick={() => markRead(notif.id)} className="text-[10px] text-brand-primary flex-shrink-0 hover:underline">Mark read</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-brand-gray-light" />

        {/* User profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-brand-dark leading-tight">
              Sarah Jenkins
            </p>
            <p
              className="text-[10px] text-brand-gray-dark uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Head of TA
            </p>
          </div>
          <div
            className="w-8 h-8 rounded-none overflow-hidden border-2 border-brand-gray-light group-hover:border-brand-primary transition-colors flex-shrink-0 bg-brand-white"
          >
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=transparent"
              alt="Sarah Jenkins"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
