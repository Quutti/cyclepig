import { Component, Input, OnInit, ElementRef } from "@angular/core";
import * as _ from 'lodash';

@Component({
    selector: "sh-form-field",
    templateUrl: "./form-field.component.html",
    styleUrls: ["./form-field.component.scss"]
})
export class FormFieldComponent implements OnInit {

    private _control: HTMLElement;

    public inputId: string = '';

    @Input() label: string = "";

    constructor(private _element: ElementRef) {

    }

    public ngOnInit() {

        this._control = this._element.nativeElement.querySelector('[shFormControl]');

        if (!this._control) {
            throw new Error("FormFieldComponent: control not found");
        }

        this._initControl();
    }

    private _initControl() {
        this._control.classList.add("form-control");

        if (this._control.id) {
            this.inputId = this._control.id;
        } else {
            this.inputId = _.uniqueId("sh-form-field");
            this._control.id = this.inputId;
        }

    }

}