import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";

import { UserService } from "./user.service";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _userService: UserService,
        private _router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this._userService.getUser()
            .then(user => {
                if (user) {
                    return true;
                }

                this._router.navigate(["/login"]);
                return false;
            });
    }

}