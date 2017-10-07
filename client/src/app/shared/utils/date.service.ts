import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable()
export class DateUtilsService {

    public validators = new DateTimeValidators(this);

    public formatDate(date: Date): string {
        const prefix = (n: number): string => ((n < 10) ? "0" : "") + n;
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return [date.getFullYear(), prefix(m), prefix(d)].join("-");
    }

    /**
     * @see https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript
     */
    public isLeapYear(year: number): boolean {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
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
        if (month && (month < 1 || month > 12)) {
            throw new Error("Month must be between 1 and 12");
        }

        return [31, (this.isLeapYear ? 29 : 28), 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
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

        const isValidDate = (str: string) => {
            const parts = str.split('-');
            if (parts.length !== 3) {
                return false;
            }
            const [yInt, mInt, dInt] = parts.map(s => parseInt(s, 10));
            return (yInt >= 1500 && yInt <= 2500) &&
                (mInt >= 1 && mInt <= 12) &&
                (dInt >= 1 && dInt <= this._utils.getMonthDayCount(yInt, mInt));
        }

        const { value } = c;

        if (typeof value !== 'undefined' && !isValidDate(value)) {
            return { dateStr: true }
        }

        return null;
    }

}