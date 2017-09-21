import { NgModule } from "@angular/core";

import { SharedModule } from "../shared";

import { HomeView } from "./home.view";
import { AddRideWidget } from "./widgets/add-ride";

@NgModule({
    imports: [SharedModule],
    exports: [HomeView],
    declarations: [
        HomeView,
        AddRideWidget
    ]
})
export class HomeModule { }