import { axiosInterceptors } from "../../axiosInterceptors/axiosInterceptors";
import type {
  MarkAllResponseType,
  MarkReadResponseType,
  NotificationsResponseType,
  UnreadCountResponseType,
} from "./Notifications.interface";

export async function getNotifications(unreadOnly: boolean, page: number) {
  const res = await axiosInterceptors.get<NotificationsResponseType>(
    "/notifications",
    {
      params: {
        page,
        limit: 10,
        ...(unreadOnly ? { unread: false } : {}),
      },
    },
  );
  return res.data;
}
export async function getUnreadCount() {
  const res = await axiosInterceptors.get<UnreadCountResponseType>(
    "/notifications/unread-count",
  );
  return res.data.data.unreadCount;
}

export async function markAsRead(notificationId: string) {
  const res = await axiosInterceptors.patch<MarkReadResponseType>(
    `/notifications/${notificationId}/read`,
  );
  return res.data;
}

export async function markAllAsRead() {
  const res = await axiosInterceptors.patch<MarkAllResponseType>(
    "/notifications/read-all",
  );
  return res.data;
}