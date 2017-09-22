import { NgModule } from "@angular/core";

import { SharedModule } from "../shared";

import { HomeView } from "./home.view";
import { AddRideComponent } from "./add-ride";

@NgModule({
    imports: [SharedModule],
    exports: [HomeView],
    declarations: [
        HomeView,
        AddRideComponent
    ]
})
export class HomeModule { }