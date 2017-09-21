import { NgModule } from "@angular/core";

import { AuthGuard } from "./auth-guard.service";
import { UserService } from "./user.service";

import { NavigationBarComponent } from "./navigation-bar/navigation-bar.component";

@NgModule({
    imports: [],
    exports: [
        NavigationBarComponent
    ],
    declarations: [
        NavigationBarComponent
    ],
    providers: [
        UserService,
        AuthGuard
    ]
})
export class CoreModule { }