
/**
 * @see https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript
 */
export const isLeapYear = (year: number): boolean => {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

export const getMonthDayCount = (year: number, month: number): number => {
    if (month && (month < 1 || month > 12)) {
        throw new Error("Month must be between 1 and 12");
    }

    return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/**
 * @see http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889
 */
export const getWeekNumber = (date: Date): number => {
    const d = new Date(date.valueOf());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));

    const todayMs = d.valueOf();
    const janFirstMs = new Date(d.getFullYear(), 0, 1).valueOf();

    return Math.ceil(((((todayMs - janFirstMs) / 8.64e7) + 1) / 7));
}


export const jsonDateToDate = (jsonDate: string): Date => {
    const parts = jsonDate.split("-");
    const date = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[0], 10);
    return new Date(year, month, date);
}

export const dateToJsonDate = (date: Date): string => {
    const prefix = (val: number): string => (val < 10) ? `0${val}` : `${val}`;
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${prefix(m)}-${prefix(d)}`;
}