import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
    selector: "c-sidemenu",
    templateUrl: "./sidemenu.component.html",
    styleUrls: ["./sidemenu.component.scss"]
})
export class SidemenuComponent implements OnInit {

    // Flag to tell component to wait before hiding container element so animations can run to the end
    public closing: boolean = false;
    private _visible: boolean = false;
    private _inited: boolean = false;

    @Input()
    set visible(value: boolean) {

        if (!value && this._inited) {
            this.closing = true;
        }

        this._visible = value;
    }
    get visible(): boolean {
        return this._visible;
    }
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    public ngOnInit() {
        this._inited = true;
    }

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