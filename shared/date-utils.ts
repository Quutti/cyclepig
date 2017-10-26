
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