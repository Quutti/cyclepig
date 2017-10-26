
import * as dateUtils from "./date-utils";

export const isValidJsonDate = (dateString: string): boolean => {
    const parts = dateString.split('-');

    if (parts.length !== 3) {
        return false;
    }

    const [yInt, mInt, dInt] = parts.map(s => parseInt(s, 10));

    return (yInt >= 1500 && yInt <= 2500) &&
        (mInt >= 1 && mInt <= 12) &&
        (dInt >= 1 && dInt <= dateUtils.getMonthDayCount(yInt, mInt));
}

export const isValidFloatingNumber = (number: string | number) => {
    const n = "" + number;
    return /^-?\d+\.?\d*$/.test(n);
}