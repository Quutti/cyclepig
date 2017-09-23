import { Injectable, Inject, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

import 'rxjs/add/operator/map';

export interface Ride {
    id: number;
    description: string;
    distance: number;
    date: string;
}

Injectable()
export class RidesService {

    constructor(
        /** @todo Little bit mystery why this use of Inject decorator is needed here... */
        @Inject(Http) private _http: Http
    ) { }

    public getRides(): Observable<Ride[]> {
        return this._http.get("/api/v1/rides")
            .map(response => response.json().payload as Ride[]);
    }

}