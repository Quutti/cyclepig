import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { BikesService } from "./bikes.service";
import { BikesResolver } from "./bikes.resolver";

@NgModule({
    imports: [HttpModule],
    exports: [],
    declarations: [],
    providers: [
        BikesService,
        BikesResolver
    ]
})
export class BikesModule { }