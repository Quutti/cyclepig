import { Component } from "@angular/core";

import "../styles/main.scss";

@Component({
    selector: "app",
    templateUrl: "./app.component.html"
})
export class AppComponent {

    public menuVisible = false;


    public onMenuOpenerClick(evt: MouseEvent) {
        this.menuVisible = true;
    }

}