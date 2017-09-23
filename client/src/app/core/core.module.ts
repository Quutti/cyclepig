import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AuthGuard } from "./auth-guard.service";
import { UserService } from "./user.service";
import { ErrorService } from "./error.service";
import { NotificationsService } from "./notifications.service";

import { NavigationBarComponent } from "./navigation-bar";
import { SidemenuComponent } from "./sidemenu";
import { SidemenuItemComponent } from "./sidemenu-item";
import { NotificationsComponent } from "./notifications";
import { NotificationItemComponent } from "./notification-item";

const components = [
    NavigationBarComponent,
    SidemenuComponent,
    SidemenuItemComponent,
    NotificationsComponent,
    NotificationItemComponent
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [...components],
    declarations: [...components],
    providers: [
        UserService,
        ErrorService,
        AuthGuard,
        NotificationsService
    ]
})
export class CoreModule { }