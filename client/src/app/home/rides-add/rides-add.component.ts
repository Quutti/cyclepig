import { Component, OnInit, Input } from "@angular/core";
import { AbstractControl, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";

import { RidesService } from "../../rides";
import { DateUtilsService } from "../../shared";
import { Bike } from "../../bikes";

@Component({
    selector: "hm-rides-add",
    templateUrl: "./rides-add.component.html"
})
export class RidesAddComponent implements OnInit {

    @Input() bikes: Bike[] = [];

    public mainForm: FormGroup;

    constructor(
        private _fb: FormBuilder,
        private _ridesService: RidesService,
        private _dateUtils: DateUtilsService
    ) { }

    public handleFormSubmit(e: Event) {
        if (this.mainForm.valid) {
            this._ridesService.addRide(this.mainForm.value);
        }
    }

    public ngOnInit() {
        const date = this._dateUtils.formatDate(new Date());

        this.mainForm = this._fb.group({
            bikeId: [this.bikes[0].id, [Validators.required, validateNumber]],
            description: [null, [Validators.required]],
            distance: [null, [Validators.required, validateNumber]],
            date: [date, [Validators.required, this._dateUtils.validators.dateString]]
        });
    }
}

function validateNumber(c: AbstractControl): { [key: string]: boolean } | null {
    const { value } = c;
    if (typeof value !== 'undefined' && isNaN(value)) {
        return { number: true }
    }
    return null;
}