import { Component, Input } from "@angular/core";

import { Bike } from "../../bikes";

@Component({
    selector: "hm-rides-add",
    templateUrl: "./rides-add.component.html"
})
export class RidesAddComponent {

    @Input() bikes: Bike[] = [];

}