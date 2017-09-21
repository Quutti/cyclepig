import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";

import { AppRoutingModule } from "./app-routing.module";
import { CoreModule } from "./core";

import { AppComponent } from "./app.component";

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        CoreModule,
        HttpModule,
        CommonModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }