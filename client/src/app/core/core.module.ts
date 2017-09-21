import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthGuard } from "./auth-guard.service";
import { UserService } from "./user.service";

import { NavigationBarComponent } from "./navigation-bar";
import { SidemenuComponent } from "./sidemenu";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        NavigationBarComponent,
        SidemenuComponent
    ],
    declarations: [
        NavigationBarComponent,
        SidemenuComponent
    ],
    providers: [
        UserService,
        AuthGuard
    ]
})
export class CoreModule { }