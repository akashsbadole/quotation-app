// Firebase Notification Service
// Handles push notifications, in-app notifications, and real-time updates

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'quotation' | 'approval' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId?: string;
  data?: any;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
}

class FirebaseNotificationService {
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];
  private isInitialized = false;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.initializeMockData();
    this.requestPermission();
  }

  // Initialize Firebase (mock implementation)
  async initialize(config: FirebaseConfig): Promise<boolean> {
    try {
      console.log('Initializing Firebase with config:', config);
      
      // In a real implementation, this would initialize Firebase SDK
      // import { initializeApp } from 'firebase/app';
      // import { getMessaging, getToken, onMessage } from 'firebase/messaging';
      
      this.isInitialized = true;
      console.log('Firebase notification service initialized successfully');
      
      // Setup service worker for background notifications
      await this.setupServiceWorker();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      if ('Notification' in window) {
        this.permission = await Notification.requestPermission();
        console.log('Notification permission:', this.permission);
        return this.permission === 'granted';
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Setup service worker for background notifications
  private async setupServiceWorker(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        // In a real implementation, you would register the Firebase messaging service worker
        console.log('Service worker setup for Firebase messaging');
      }
    } catch (error) {
      console.error('Error setting up service worker:', error);
    }
  }

  // Send push notification
  async sendPushNotification(notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>): Promise<boolean> {
    try {
      const newNotification: NotificationData = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        read: false
      };

      // Add to local storage
      this.notifications.unshift(newNotification);
      this.saveToStorage();
      this.notifyListeners();

      // Show browser notification if permission granted
      if (this.permission === 'granted') {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: newNotification.id,
          data: notification.data,
          requireInteraction: notification.priority === 'urgent'
        });

        browserNotification.onclick = () => {
          if (notification.actionUrl) {
            window.focus();
            window.location.href = notification.actionUrl;
          }
          browserNotification.close();
        };

        // Auto close after 5 seconds for non-urgent notifications
        if (notification.priority !== 'urgent') {
          setTimeout(() => browserNotification.close(), 5000);
        }
      }

      console.log('Push notification sent:', newNotification);
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  // Send in-app notification
  sendInAppNotification(notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>): string {
    const newNotification: NotificationData = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifyListeners();

    return newNotification.id;
  }

  // Get all notifications
  getNotifications(userId?: string): NotificationData[] {
    let filtered = this.notifications;
    
    if (userId) {
      filtered = filtered.filter(n => !n.userId || n.userId === userId);
    }

    // Remove expired notifications
    const now = new Date();
    filtered = filtered.filter(n => !n.expiresAt || new Date(n.expiresAt) > now);

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get unread count
  getUnreadCount(userId?: string): number {
    return this.getNotifications(userId).filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Mark all as read
  markAllAsRead(userId?: string): void {
    this.notifications.forEach(notification => {
      if (!userId || !notification.userId || notification.userId === userId) {
        notification.read = true;
      }
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  // Delete notification
  deleteNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Subscribe to notifications
  subscribe(callback: (notifications: NotificationData[]) => void): () => void {
    this.listeners.push(callback);
    
    // Send initial data
    callback(this.getNotifications());
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Send quotation-specific notifications
  async sendQuotationNotification(type: 'created' | 'updated' | 'sent' | 'approved' | 'rejected', quotationData: any): Promise<void> {
    const notifications: { [key: string]: Partial<NotificationData> } = {
      created: {
        title: 'New Quotation Created',
        message: `Quotation ${quotationData.referenceNumber} has been created for ${quotationData.customerName}`,
        type: 'quotation',
        priority: 'medium'
      },
      updated: {
        title: 'Quotation Updated',
        message: `Quotation ${quotationData.referenceNumber} has been updated`,
        type: 'quotation',
        priority: 'low'
      },
      sent: {
        title: 'Quotation Sent',
        message: `Quotation ${quotationData.referenceNumber} has been sent to ${quotationData.customerEmail}`,
        type: 'success',
        priority: 'medium'
      },
      approved: {
        title: 'Quotation Approved',
        message: `Quotation ${quotationData.referenceNumber} has been approved`,
        type: 'success',
        priority: 'high'
      },
      rejected: {
        title: 'Quotation Rejected',
        message: `Quotation ${quotationData.referenceNumber} has been rejected`,
        type: 'warning',
        priority: 'high'
      }
    };

    const notification = notifications[type];
    if (notification) {
      await this.sendPushNotification({
        ...notification,
        data: quotationData,
        actionUrl: `/quotations/${quotationData.id}`,
        actionText: 'View Quotation'
      } as Omit<NotificationData, 'id' | 'createdAt' | 'read'>);
    }
  }

  // Send approval notifications
  async sendApprovalNotification(type: 'required' | 'approved' | 'rejected', approvalData: any): Promise<void> {
    const notifications: { [key: string]: Partial<NotificationData> } = {
      required: {
        title: 'Approval Required',
        message: `Quotation ${approvalData.quotationNumber} requires your approval`,
        type: 'approval',
        priority: 'high'
      },
      approved: {
        title: 'Approval Granted',
        message: `Your approval for quotation ${approvalData.quotationNumber} has been processed`,
        type: 'success',
        priority: 'medium'
      },
      rejected: {
        title: 'Approval Rejected',
        message: `Quotation ${approvalData.quotationNumber} approval has been rejected`,
        type: 'warning',
        priority: 'high'
      }
    };

    const notification = notifications[type];
    if (notification) {
      await this.sendPushNotification({
        ...notification,
        data: approvalData,
        actionUrl: `/workflow/approvals/${approvalData.id}`,
        actionText: 'View Approval'
      } as Omit<NotificationData, 'id' | 'createdAt' | 'read'>);
    }
  }

  // Private helper methods
  private notifyListeners(): void {
    const notifications = this.getNotifications();
    this.listeners.forEach(callback => callback(notifications));
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('firebase_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('firebase_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
  }

  private initializeMockData(): void {
    this.loadFromStorage();
    
    // Add some initial notifications if none exist
    if (this.notifications.length === 0) {
      const mockNotifications: NotificationData[] = [
        {
          id: 'notif-001',
          title: 'Welcome to QuoteManager',
          message: 'Your quotation management system is ready to use!',
          type: 'success',
          priority: 'medium',
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: '/dashboard',
          actionText: 'Go to Dashboard'
        },
        {
          id: 'notif-002',
          title: 'New Quotation Approval Required',
          message: 'Quotation QUO-2024-001 requires your approval',
          type: 'approval',
          priority: 'high',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          actionUrl: '/workflow/approvals',
          actionText: 'Review Approval'
        }
      ];

      this.notifications = mockNotifications;
      this.saveToStorage();
    }
  }
}

// Export singleton instance
export const firebaseNotificationService = new FirebaseNotificationService();

// Initialize with mock config
firebaseNotificationService.initialize({
  apiKey: "mock-api-key",
  authDomain: "quotemanager.firebaseapp.com",
  projectId: "quotemanager",
  storageBucket: "quotemanager.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  vapidKey: "mock-vapid-key"
});

export default FirebaseNotificationService;
