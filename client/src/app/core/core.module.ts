import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AuthGuard } from "./auth-guard.service";
import { UserService } from "./user.service";
import { ErrorService } from "./error.service";

import { NavigationBarComponent } from "./navigation-bar";
import { SidemenuComponent } from "./sidemenu";
import { SidemenuItemComponent } from "./sidemenu-item";

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        NavigationBarComponent,
        SidemenuComponent,
        SidemenuItemComponent
    ],
    declarations: [
        NavigationBarComponent,
        SidemenuComponent,
        SidemenuItemComponent
    ],
    providers: [
        UserService,
        ErrorService,
        AuthGuard
    ]
})
export class CoreModule { }