import { Injectable, EventEmitter } from "@angular/core";
import * as _ from "lodash";

export type NotificationLevel = "success" | "error";

export interface Notification {
    id?: string;
    title: string;
    level?: NotificationLevel;
    message?: string;
    sticky?: boolean
    timeout?: number;
}

@Injectable()
export class NotificationsService {

    public notificationsBroadcast = new EventEmitter<Notification>();

    public addNotification(notification: Notification) {
        notification.id = _.uniqueId("notifications");

        notification.message = notification.message || "";
        notification.timeout = notification.timeout || 3000;
        notification.level = notification.level || "success";

        this.notificationsBroadcast.emit(notification);
    }

}