import { NgModule } from "@angular/core";

import { CardComponent } from "./card";
import { FormFieldComponent } from "./form-field";

import { FormControlDirective } from "./form-control";

const components = [
    CardComponent,
    FormFieldComponent
]

const directives = [
    FormControlDirective
]

@NgModule({
    imports: [],
    exports: [...components, ...directives],
    declarations: [...components, ...directives]
})
export class SharedModule { }