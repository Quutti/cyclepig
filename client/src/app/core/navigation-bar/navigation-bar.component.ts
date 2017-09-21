import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "c-navigation-bar",
    templateUrl: "./navigation-bar.component.html",
    styleUrls: ["./navigation-bar.component.scss"]
})
export class NavigationBarComponent {

    @Input() brand: string;
    @Output() menuOpenerClicked = new EventEmitter<MouseEvent>();

    public handleMenuClick(evt: MouseEvent) {
        this.menuOpenerClicked.emit(evt);
    }

}