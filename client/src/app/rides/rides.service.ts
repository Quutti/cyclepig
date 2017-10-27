import { Injectable, Inject, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { NotificationsService, Notification } from "../core";
import { Ride } from "@shared/types";

Injectable()
export class RidesService {

    constructor(
        /** @todo Little bit mystery why this use of Inject decorator is needed here... */
        @Inject(Http) private _http: Http,
        @Inject(NotificationsService) private _notificationsService: NotificationsService
    ) { }

    public getRides(): Observable<Ride[]> {
        return this._http.get("/api/v1/rides")
            .map(response => response.json().payload as Ride[]);
    }

    public addRide(ride: Ride): Promise<void> {
        return this._http.post("/api/v1/rides", ride)
            .toPromise()
            .then(response => {
                this._notificationsService.addNotification({
                    level: "success",
                    title: "New ride saved"
                });
            })
            .catch(err => {
                let notification: Notification;

                if (err && err.status === 400) {
                    notification = {
                        level: "error",
                        message: err.json().payload.message,
                        title: "Bad request"
                    };
                } else {
                    notification = {
                        level: "error",
                        title: "Some odd error happaned"
                    };
                }

                this._notificationsService.addNotification(notification);
            });
    }

}