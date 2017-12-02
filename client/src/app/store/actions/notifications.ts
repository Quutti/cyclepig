import * as _ from "lodash";

import {
    NOTIFICATIONS_ADD,
    NOTIFICATIONS_REMOVE,
    Notification
} from "../types";

export const addNotification = (notification: Notification) => {

    // Add default values for notification
    notification.id = notification.id || _.uniqueId("notification");
    notification.timeout = notification.timeout || 3000;

    return {
        type: NOTIFICATIONS_ADD,
        notification
    }
}

export const removeNotification = (notificationId: string) => {
    return {
        type: NOTIFICATIONS_REMOVE,
        notificationId
    }
}