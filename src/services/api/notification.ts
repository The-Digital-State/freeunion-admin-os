import { api } from './helper';

export async function getNotificationLists() {
  try {
    const response = await api().get<any>(`/me/notifications?status=0&page=1&limit=15`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

//do not take notification at current user id
export async function getUserNotification(notificationId: number) {
  try {
    const response = await api().get<any>(`/me/notifications/${notificationId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function sendNotification(
  org: number,
  {
    title,
    message,
    members,
    lists,
  }: {
    title: string;
    message: string;
    members: number[];
    lists: number[];
  }
) {
  try {
    const response = await api().post<any>(`/admin_org/${org}/send_announcement`, {
      members,
      lists,
      title,
      message,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
