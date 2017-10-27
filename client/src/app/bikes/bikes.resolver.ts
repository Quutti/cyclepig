import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { BikesService, Bike } from "./bikes.service";

@Injectable()
export class BikesResolver implements Resolve<Bike[]> {

    constructor(
        private _bikesService: BikesService
    ) { }

    resolve(): Promise<Bike[]> {
        return this._bikesService.getBikes();
    }

}