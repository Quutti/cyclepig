import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "./core";
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
        private _userService: UserService
    ) { }

    public onMenuOpenerClick(evt: MouseEvent) {
        this.menuVisible = true;
    }

    public handleLogout() {
        this._userService.logout()
            .then(() => {
                this._router.navigate(["/login"]);
            })
    }

    public ngOnInit() {
        this._userService.loginStatusBroadcast.subscribe((isLoggedIn: boolean) => {
            this.isLoggedIn = isLoggedIn;
        })
    }

}