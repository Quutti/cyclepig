import { NgModule } from "@angular/core";
import { Routes, RouterModule, ExtraOptions } from "@angular/router";

import { SharedModule } from "./shared/shared.module";
import { HomeModule, HomeView } from "./home";
import { AuthGuard } from "./core";
import { NotFoundView } from "./404";
import { LoginModule, LoginView } from "./login";
import { BikesModule, BikesResolver } from "./bikes";
import { RidesModule, RidesResolver } from "./rides";


const routerConfig: ExtraOptions = {
    //enableTracing: true
};

const routes: Routes = [{
    path: "login",
    component: LoginView
}, {
    path: "",
    pathMatch: "full",
    component: HomeView,
    resolve: {
        bikes: BikesResolver,
        rides: RidesResolver
    },
    canActivate: [AuthGuard]
}, {
    path: "**",
    component: NotFoundView
}];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, routerConfig),
        SharedModule,
        HomeModule,
        LoginModule,
        BikesModule,
        RidesModule
    ],
    declarations: [
        NotFoundView
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }