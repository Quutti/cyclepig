import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared";

import { HomeView } from "./home.view";
import { AddRideComponent } from "./add-ride";

@NgModule({
    imports: [
        SharedModule,
        CommonModule
    ],
    exports: [HomeView],
    declarations: [
        HomeView,
        AddRideComponent
    ]
})
export class HomeModule { }