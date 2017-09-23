import { Injectable, Inject, EventEmitter } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

import 'rxjs/add/operator/map';

export interface Bike {
    id: number;
    name: string;
}

Injectable()
export class BikesService {

    public bikesSubscription: EventEmitter<Bike[]> = new EventEmitter<Bike[]>();

    constructor(
        /** @todo Little bit mystery why this use of Inject decorator is needed here... */
        @Inject(Http) private _http: Http
    ) { }

    public getBikes(): Observable<Bike[]> {
        return this._http.get("/api/v1/bikes")
            .map(response => response.json().payload as Bike[]);
    }

}