import { Injectable, Inject, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Observable, Subject } from "rxjs";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface Bike {
    id: number;
    name: string;
}

type BikeSubscriptionHandler = (bikes: Bike[]) => void;

Injectable()
export class BikesService {

    private _bikeSubject = new Subject<Bike[]>();

    constructor(
        /** @todo Little bit mystery why this use of Inject decorator is needed here... */
        @Inject(Http) private _http: Http
    ) { }

    public getBikes(): Promise<Bike[]> {
        return this._http.get("/api/v1/bikes")
            .map(response => response.json().payload as Bike[])
            .toPromise();
    }

    public subscribeBikes(f: BikeSubscriptionHandler) {
        this._bikeSubject.subscribe(f);
    }

}