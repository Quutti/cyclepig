import { Transaction } from './transaction';
import { DatabaseControllerCustomError } from "../database/common";

export const handleError = (err: any, transaction: Transaction) => {

    if (err instanceof DatabaseControllerCustomError) {
        return transaction.send.badRequest(err.message);
    }

    let errorString = err.toString();
    console.log(`[500] ${errorString}`)
    return transaction.send.internalServerError();
}

export const getUniquesFromObjectArray = (arr: { [key: string]: any }[], prop: string): any[] => {
    let res: number[] = [];

    for (let item of arr) {
        if (res.indexOf(item[prop]) === -1) {
            res.push(item[prop]);
        }
    }

    return res;
}

export const isEmptyObject = (obj: any): boolean => {
    return JSON.stringify(obj) === '{}';
}

export const safeIntegerArray = (arr: any[], def: number = -1): number[] => {
    return arr.map(item => {
        let parsed = parseInt(item, 10);
        return (isNaN(parsed)) ? def : parsed;
    });
}