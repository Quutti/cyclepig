export interface RootState {
    notifications: NotificationsState;
}

/* Notifications */

export const NOTIFICATIONS_ADD = "NOTIFICATIONS_ADD";
export const NOTIFICATIONS_REMOVE = "NOTIFICATIONS_REMOVE";

export interface NotificationsState {
    items: Notification[];
}

export type NotificationType = "success" | "error";

export interface Notification {
    id?: string;
    title: string;
    type?: NotificationType;
    message?: string;
    timeout?: number;
    sticky?: boolean;
}