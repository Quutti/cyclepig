import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared";

import { HomeView } from "./home.view";
import { RidesAddComponent } from "./rides-add";
import { RidesBurnupComponent } from "./rides-burnup";

@NgModule({
    imports: [
        SharedModule,
        CommonModule
    ],
    exports: [HomeView],
    declarations: [
        HomeView,
        RidesAddComponent,
        RidesBurnupComponent
    ]
})
export class HomeModule { }