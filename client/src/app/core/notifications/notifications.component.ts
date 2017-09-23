import { Component, OnInit } from "@angular/core";

import { NotificationsService, Notification } from "../notifications.service";

@Component({
    selector: "c-notifications",
    templateUrl: "./notifications.component.html"
})
export class NotificationsComponent implements OnInit {

    public activeNotifications: Notification[] = [];

    constructor(
        private _notificationsService: NotificationsService
    ) { }

    public handleNotificationClose(notificationId: string) {
        const index = this.activeNotifications
            .map(n => n.id)
            .indexOf(notificationId);

        if (index > -1) {
            // Create clone of array so reference changes and angular knows
            // that there is changes made
            //let notifications = [...this.activeNotifications];
            //notifications.splice(index, 1);

            //this.activeNotifications = notifications;

            this.activeNotifications.splice(index, 1);
        }
    }

    public ngOnInit() {
        // Subscribe to notifications broadcast to get newly added notifications
        this._notificationsService.notificationsBroadcast.subscribe((notification: Notification) => {
            this.activeNotifications.push(notification);
            //this.activeNotifications = [...this.activeNotifications, notification];
        });
    }

}