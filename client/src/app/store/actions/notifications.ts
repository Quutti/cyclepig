import * as _ from "lodash";

import {
    NOTIFICATIONS_ADD,
    NOTIFICATIONS_REMOVE,
    Notification
} from "../types";

export const addNotification = (notification: Notification) => {

    // Add unique id for the notification if not set
    if (!notification.id) {
        notification.id = _.uniqueId("notification");
    }

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