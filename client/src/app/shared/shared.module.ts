import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CardComponent } from "./card";
import { FormFieldComponent } from "./form-field";
import { LineChartComponent } from "./line-chart"

import { FormControlDirective } from "./form-control";

const components = [
    CardComponent,
    FormFieldComponent,
    LineChartComponent
]

const directives = [
    FormControlDirective
]

@NgModule({
    imports: [CommonModule],
    exports: [...components, ...directives],
    declarations: [...components, ...directives]
})
export class SharedModule { }