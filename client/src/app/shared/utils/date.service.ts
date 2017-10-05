import { Injectable } from "@angular/core";

@Injectable()
export class DateUtilsService {

    formatDate(date: Date): string {
        const m = date.getMonth() + 1;
        const d = date.getDate();

        return [
            date.getFullYear(),
            ((m < 10) ? "0" : "") + m,
            ((d < 10) ? "0" : "") + d
        ].join("-");
    }

}