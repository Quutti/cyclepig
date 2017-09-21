import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { LoginView } from "./login.view";
import { SharedModule } from "../shared";

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule
    ],
    exports: [],
    declarations: [LoginView]
})
export class LoginModule { }