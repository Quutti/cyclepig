import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { UserService, NotificationsService } from "./core";
import "../styles/main.scss";

@Component({
    selector: "app",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {

    public menuVisible: boolean = false;
    public isLoggedIn: boolean = false;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _notificationsService: NotificationsService
    ) { }

    public onMenuOpenerClick(evt: MouseEvent) {
        this.menuVisible = true;
    }

    public closeSidemenu() {
        this.menuVisible = false;
    }

    public handleLogout() {
        this._userService.logout()
            .then(() => {
                this.menuVisible = false;
                this._router.navigate(["/login"]);
            })
    }

    public ngOnInit() {
        this._userService.loginStatusBroadcast.subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
        });
    }

}