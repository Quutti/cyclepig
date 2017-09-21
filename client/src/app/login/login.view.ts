import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "../core/user.service";

@Component({
    templateUrl: "./login.view.html"
})
export class LoginView {

    public login: string = "";
    public password: string = "";
    public message: string = "";

    constructor(
        private _userService: UserService,
        private _router: Router
    ) { }

    public handleLoginSubmit(evt: Event) {
        evt.preventDefault();

        this.message = "";

        this._userService.login(this.login, this.password)
            .then(res => {
                this._router.navigate(["/"]);
            })
            .catch((err: Response) => {
                if (!err || !err.status) {
                    /** @todo Real error handling here */
                    console.error(err);
                }

                if (err.status === 400) {
                    this.message = "Username or password missing"
                } else if (err.status === 401) {
                    this.message = "Username or password is incorrect"
                }
            });
    }

}