import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from "@angular/core";

import { Notification } from "../notifications.service";

@Component({
    selector: "c-notification-item",
    templateUrl: "./notification-item.component.html",
    styleUrls: ["./notification-item.component.scss"]
})
export class NotificationItemComponent implements OnInit {

    public item: Notification = null;
    public visible: boolean = false;
    public icon: string = ""

    @Input()
    set notification(value: Notification) {
        this.item = value;
        this.icon = (this.item.level === "error" ? "legal" : "info");
    }
    get notification(): Notification {
        return this.item;
    }

    @Output() onClose = new EventEmitter<string>();

    constructor() { }

    public handleTransitionEnd() {
        if (this.visible) {
            return;
        }

        this.onClose.emit(this.notification.id);
    }

    public handleCloseButtonClick() {
        this._triggerClosing();
    }

    public ngOnInit() {
        if (!this.notification.sticky) {
            setTimeout(() => {
                this._triggerClosing();
            }, this.notification.timeout);
        }
    }

    public ngAfterViewInit() {
        setTimeout(() => this.visible = true);
    }

    private _triggerClosing() {
        this.visible = false;
    }

}