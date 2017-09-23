import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { BikesService, Bike } from "../bikes";
import { RidesService, Ride } from "../rides";

@Component({
    templateUrl: "./home.view.html"
})
export class HomeView implements OnInit {

    public bikes: Bike[] = [];
    public rides: Ride[] = [];

    constructor(
        private _route: ActivatedRoute,
        private _bikesService: BikesService,
        private _ridesService: RidesService
    ) { }

    public ngOnInit() {
        this.bikes = this._route.snapshot.data["bikes"];
        this._bikesService.getBikes().subscribe((bikes: Bike[]) => {
            this.bikes = bikes;
        });

        this.rides = this._route.snapshot.data["rides"];
        this._ridesService.getRides().subscribe((rides: Ride[]) => {
            this.rides = rides;
        });
    }

}