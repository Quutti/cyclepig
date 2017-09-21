import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "c-sidemenu",
    templateUrl: "./sidemenu.component.html",
    styleUrls: ["./sidemenu.component.scss"]
})
export class SidemenuComponent {

    // Flag to tell component to wait before hiding container element so animations can run to the end
    public closing: boolean = false;

    @Input() visible: boolean = false;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    public close() {

        // Prevent unexpected behavior when double clicking the shroud
        if (this.closing) {
            return;
        }

        this._changeVisibility();
        this.closing = true;
    }

    public closingReady() {
        this.closing = false;
    }

    private _changeVisibility() {
        this.visible = !this.visible;
        this.visibleChange.emit(this.visible);
    }

}