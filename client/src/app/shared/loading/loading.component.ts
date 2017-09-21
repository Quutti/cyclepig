import { Component, Input, ElementRef } from "@angular/core";


@Component({
    selector: "sh-loading",
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.scss"]
})
export class LoadingComponent {

    private _elementRef: ElementRef;
    private _top: number = 50;
    private _image: string = "assets/img/loading.svg";

    @Input()
    set top(value: number) {
        this._top = value;
        this._updateTop();
    }
    get top(): number { return this._top }

    @Input()
    set image(value: string) { this._image = value; }
    get image(): string { return this._image }

    constructor(elementRef: ElementRef) {
        this._elementRef = elementRef;
        this._updateTop();
    }

    private _updateTop() {
        const elm = (this._elementRef.nativeElement as HTMLElement);
        elm.style.marginTop = `${this._top}px`;
    }
}