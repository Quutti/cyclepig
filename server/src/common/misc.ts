import { Transaction } from './transaction';

export const handleError = (err: any, transaction: Transaction) => {
    let errorString = err.toString();
    console.log(`[500] ${errorString}`)
    transaction.send.internalServerError();
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