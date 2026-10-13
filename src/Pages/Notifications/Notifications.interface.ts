export interface NotificationActor {
  _id: string;
  name: string;
  photo: string;
}

export interface NotificationEntity {
  _id: string;
  body?: string;
  image?: string;
  name?: string;
  username?: string;
}

export interface NotificationItem {
  _id: string;
  actor: NotificationActor;
  type: string; 
  entityType: string; 
  entityId: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  entity?: NotificationEntity | null;
}

export interface NotificationsResponseType {
  success: boolean;
  message: string;
  data: { notifications: NotificationItem[] };
  meta: {
    pagination: {
      currentPage: number;
      limit: number;
      total: number;
      numberOfPages: number;
      nextPage?: number;
    };
  };
}

export interface UnreadCountResponseType {
  success: boolean;
  message: string;
  data: { unreadCount: number };
}

export interface MarkReadResponseType {
  success: boolean;
  message: string;
  data: { notification: NotificationItem };
}

export interface MarkAllResponseType {
  success: boolean;
  message: string;
  data: { modifiedCount: number };
}