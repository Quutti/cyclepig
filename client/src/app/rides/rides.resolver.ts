import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

import { RidesService, Ride } from "./rides.service";

@Injectable()
export class RidesResolver implements Resolve<Ride[]> {

    constructor(
        private _ridesService: RidesService
    ) { }

    resolve(): Observable<Ride[]> {
        return this._ridesService.getRides();
    }

}