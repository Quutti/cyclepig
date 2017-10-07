import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable()
export class DateUtilsService {

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