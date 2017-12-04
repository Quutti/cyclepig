import * as DB from "easy-mysql-with-promise";
import * as Promise from "bluebird";

import { IDatabaseController, IDatabaseConnection, throwDatabaseControllerError } from "./common";
import * as bikeHelpers from "../endpoints/bikes/helpers";

import { Ride } from "@shared/types";
import * as validators from "@shared/validators";

export class RideDatabaseController implements IDatabaseController<Ride> {

    private _db: IDatabaseConnection;

    constructor(connection: IDatabaseConnection) {
        this._db = connection;
    }

    public getSingle(userId: number, id: number): Promise<Ride> {
        const sql = `
            SELECT r.*
            FROM rides AS r
            INNER JOIN bikes AS b
            ON r.bikeId = b.id
            WHERE b.userId = ?
            AND r.id = ?
        `;

        return this._db.query(sql, [userId, id])
            .then(res => res[0] || null);
    }

    public getAll(userId: number): Promise<Ride[]> {
        const sql = `
            SELECT r.* 
            FROM rides AS r
            INNER JOIN bikes AS b
            ON r.bikeId = b.id
            WHERE b.userId = ?
        `;

        return this._db.query(sql, [userId]);
    }

    public insert(userId: number, item: Partial<Ride>): Promise<Ride> {

        const validationMessage = this._validateItem(item);
        if (validationMessage) {
            throwDatabaseControllerError(validationMessage);
        }

        return bikeHelpers.isUsersBike(userId, item.bikeId)
            .then(isUsersBike => {
                if (!isUsersBike) {
                    throwDatabaseControllerError("Bike with given id not found");
                }

                // Take only properties that can be added
                const { bikeId, date, distance, description } = item;
                const newRide: Ride = { bikeId, date, distance, description };

                return newRide;
            })
            .then((newRide: Ride) => DB.query(`INSERT INTO rides SET ?`, [newRide]))
            .then((res) => {
                const newItemId = (typeof res.insertId === "number") ? res.insertId : -1;
                if (newItemId === -1) {
                    throwDatabaseControllerError("Adding new bike failed");
                }

                return newItemId;
            })
            .then((newItemId: number) => this.getSingle(userId, newItemId));
    }

    public update(userId: number, id: number, item: Partial<Ride>): Promise<Ride> {
        /** @todo implement */
        return Promise.resolve({} as any);
    }

    public delete(userId: number, id: number): Promise<boolean> {
        /** @todo implement */
        return Promise.resolve(true);
    }

    private _validateItem(item: Partial<Ride>): string {

        const { date, distance, description, bikeId } = item;

        if (!bikeId || typeof bikeId !== "number") {
            return `Ride should have integer property bikeId`;
        }

        if (!description || typeof description !== 'string') {
            return `Ride should have string property description`;
        }

        if (!validators.isValidJsonDate(date || "")) {
            return `Ride should have string propery date (in format yyyy-mm-dd)`;
        }

        if (typeof distance !== 'number') {
            return `Ride should have numberic property distance`;
        }

        return '';
    }
}

export const rideDatabaseController = new RideDatabaseController(DB);