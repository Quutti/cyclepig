import { Component, Input } from "@angular/core";
import { Route } from "@angular/router";

interface RouteOptions {
    exact?: boolean;
}

@Component({
    selector: "c-sidemenu-item",
    templateUrl: "./sidemenu-item.component.html",
    styleUrls: ["./sidemenu-item.component.scss"]
})
export class SidemenuItemComponent {

    private _exact: boolean = false;
    public routeOptions: RouteOptions = {};

    @Input() link: string;
    @Input() text: string;
    @Input() icon: string;
    @Input()
    set exact(value: boolean) {
        this._exact = value;
        this.routeOptions.exact = this._exact;
    }
    get exact(): boolean { return this._exact }

}