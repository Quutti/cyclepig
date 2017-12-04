import * as Promise from "bluebird";

export interface IDatabaseController<T> {
    getSingle(userId: number, id: number): Promise<T>;
    getAll(userId: number): Promise<T[]>;
    insert(userId: number, item: Partial<T>): Promise<T>;
    update(userId: number, id: number, item: Partial<T>): Promise<T>;
    delete(userId: number, id: number): Promise<boolean>;
}

export interface IDatabaseConnection {
    query(sql: string, params: any[]): Promise<any>;
}

export class DatabaseControllerCustomError extends Error { }


export function throwDatabaseControllerError(message: string) {
    throw new DatabaseControllerCustomError(message);
}