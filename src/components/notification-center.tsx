import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { firebaseNotificationService, NotificationData } from '../services/firebase-notification.service';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'quotation' | 'approval'>('all');

  useEffect(() => {
    const unsubscribe = firebaseNotificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (notificationId: string) => {
    firebaseNotificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    firebaseNotificationService.markAllAsRead();
  };

  const handleDelete = (notificationId: string) => {
    firebaseNotificationService.deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quotation': return 'lucide:file-text';
      case 'approval': return 'lucide:check-circle';
      case 'success': return 'lucide:check';
      case 'warning': return 'lucide:alert-triangle';
      case 'error': return 'lucide:x-circle';
      case 'info': return 'lucide:info';
      default: return 'lucide:bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'quotation': return 'text-blue-600 bg-blue-100';
      case 'approval': return 'text-orange-600 bg-orange-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-blue-500';
      case 'low': return 'border-l-gray-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </motion.button>
                  <motion.button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                  >
                    <Icon icon="lucide:x" className="text-xl" />
                  </motion.button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 mt-3">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'quotation', label: 'Quotes' },
                  { key: 'approval', label: 'Approvals' }
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                      filter === tab.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(tab.key as any)}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Icon icon="lucide:bell-off" className="text-4xl mb-2" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? 'bg-blue-50' : 'bg-white'
                      } hover:bg-gray-50 transition-colors duration-200`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          <Icon icon={getNotificationIcon(notification.type)} className="text-sm" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <motion.button
                                  className="text-blue-600 hover:text-blue-800"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Icon icon="lucide:check" className="text-xs" />
                                </motion.button>
                              )}
                              <motion.button
                                className="text-gray-400 hover:text-red-600"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(notification.id)}
                                title="Delete"
                              >
                                <Icon icon="lucide:trash-2" className="text-xs" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.createdAt)}
                            </span>
                            
                            {notification.actionUrl && notification.actionText && (
                              <motion.button
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  window.location.href = notification.actionUrl!;
                                  handleMarkAsRead(notification.id);
                                  onClose();
                                }}
                              >
                                {notification.actionText}
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Notification Bell Component
interface NotificationBellProps {
  onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = firebaseNotificationService.subscribe((notifications) => {
      const count = notifications.filter(n => !n.read).length;
      setUnreadCount(count);
    });
    return unsubscribe;
  }, []);

  return (
    <motion.button
      className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Icon icon="lucide:bell" className="text-xl" />
      {unreadCount > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.span>
      )}
    </motion.button>
  );
};
