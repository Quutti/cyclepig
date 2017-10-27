import { Injectable, Inject, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Observable, Subject } from "rxjs";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { NotificationsService, Notification } from "../core";
import { Ride } from "@shared/types";

type RideSubscriptionHandler = (rides: Ride[]) => void;

Injectable()
export class RidesService {

    private _ridesSubject = new Subject<Ride[]>();

    constructor(
        /** @todo Little bit mystery why this use of Inject decorator is needed here... */
        @Inject(Http) private _http: Http,
        @Inject(NotificationsService) private _notificationsService: NotificationsService
    ) { }

    public getRides(): Promise<Ride[]> {
        return this._http.get("/api/v1/rides")
            .map(response => {
                const rides: Ride[] = response.json().payload;
                this._ridesSubject.next(rides);
                return rides;
            })
            .toPromise()
    }

    public subscribeRides(f: RideSubscriptionHandler) {
        this._ridesSubject.subscribe(f);
    }

    public addRide(ride: Ride): Promise<void> {
        return this._http.post("/api/v1/rides", ride)
            .toPromise()
            .then(response => {
                this._notificationsService.addNotification({
                    level: "success",
                    title: "New ride saved"
                });

                // Fetch rides from the backend to refresh local rides cache
                // and trigger subscription emits
                this.getRides();
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