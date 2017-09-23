import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { RidesService } from "./rides.service";
import { RidesResolver } from "./rides.resolver";

@NgModule({
    imports: [HttpModule],
    exports: [],
    declarations: [],
    providers: [
        RidesService,
        RidesResolver
    ]
})
export class RidesModule { }