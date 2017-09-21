import { Component, Input } from "@angular/core";

@Component({
    selector: "sh-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"]
})
export class CardComponent {

    @Input() heading: string;

}