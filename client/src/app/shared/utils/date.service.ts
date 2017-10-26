import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

import * as validators from "@shared/validators";
import * as dateUtils from "@shared/date-utils";

@Injectable()
export class DateUtilsService {

    public validators = new DateTimeValidators(this);

    public formatDate(date: Date): string {
        const prefix = (n: number): string => ((n < 10) ? "0" : "") + n;
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return [date.getFullYear(), prefix(m), prefix(d)].join("-");
    }

    public isLeapYear(year: number): boolean {
        return dateUtils.isLeapYear(year);
    }

    /**
     * @see http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889
     */
    public getWeekNumber(date: Date) {
        let d = new Date(date.valueOf());
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        return Math.ceil(((((d as any) - (new Date(d.getFullYear(), 0, 1) as any) / 8.64e7) + 1) / 7));
    }

    /**
     * @param month 1-12
     * @param year
     */
    public getMonthDayCount(year: number, month: number): number {
        return dateUtils.getMonthDayCount(year, month);
    }


}

class DateTimeValidators {

    private _utils: DateUtilsService;

    constructor(utils: DateUtilsService) {
        this._utils = utils;

        // Bind validators to this to keep context same 
        // when validating controls in ng
        this.dateString = this.dateString.bind(this);
    }

    public dateString(c: AbstractControl): { [key: string]: boolean } | null {

        const { value } = c;

        if (typeof value !== 'undefined' && !validators.isValidJsonDate(value)) {
            return { dateStr: true }
        }

        return null;
    }

}