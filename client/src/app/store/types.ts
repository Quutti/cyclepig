export interface RootState {
    auth: AuthState;
    rides: RidesState;
    bikes: BikesState;
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

/* Rides */

export const RIDES_ADD = "RIDES_ADD";
export const RIDES_FETCHING = "RIDES_FETCHING";
export const RIDES_RECEIVED = "RIDES_RECEIVED";
export const RIDES_FAILURE = "RIDES_FAILURE";

export interface RidesState {
    items: Ride[];
    isFetching: boolean;
}

export interface Ride {
    id?: number;
    bikeId: number;
    description: string;
    distance: number;
    date?: string;
}

/* Bikes */

export const BIKES_ADD = "BIKES_ADD";
export const BIKES_FETCHING = "BIKES_FETCHING";
export const BIKES_RECEIVED = "BIKES_RECEIVED";
export const BIKES_FAILURE = "BIKES_FAILURE";

export interface BikesState {
    items: Bike[];
    isFetching: boolean;
}

export interface Bike {
    id?: number;
    name: string;
    color: string;
    added: string;
}