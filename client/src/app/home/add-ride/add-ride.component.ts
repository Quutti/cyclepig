import { Component, Input } from "@angular/core";

import { Bike } from "../../bikes";

@Component({
    selector: "hm-add-ride",
    templateUrl: "./add-ride.component.html"
})
export class AddRideComponent {

    @Input() bikes: Bike[] = [];

}