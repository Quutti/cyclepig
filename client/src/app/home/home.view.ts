import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { BikesService, Bike } from "../bikes";

@Component({
    templateUrl: "./home.view.html"
})
export class HomeView implements OnInit {

    public bikes: Bike[] = [];

    constructor(
        private _route: ActivatedRoute,
        private _bikesService: BikesService
    ) { }

    public ngOnInit() {
        this.bikes = this._route.snapshot.data["bikes"];
        this._bikesService.getBikes().subscribe((bikes: Bike[]) => {
            this.bikes = bikes;
        });
    }

}