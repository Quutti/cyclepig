export interface RootState {
    auth: AuthState;
    notifications: NotificationsState;
}

/* Auth */

export const AUTH_IN_PROGRESS = "AUTH_IN_PROGRESS";
export const AUTH_SIGNED_IN = "AUTH_SIGNED_IN";
export const AUTH_SIGNED_OUT = "AUTH_SIGNED_OUT";
export const AUTH_FETCHING = "AUTH_FETCHING";
export const AUTH_FAILURE = "AUTH_FAILURE";

export interface AuthState {
    isFetching: boolean;
    inProgress: boolean;
    user: User;
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
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