import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { Ride } from "@shared/types";
import { RidesService } from "./rides.service";

@Injectable()
export class RidesResolver implements Resolve<Ride[]> {

    constructor(
        private _ridesService: RidesService
    ) { }

    resolve(): Promise<Ride[]> {
        return this._ridesService.getRides();
    }

}