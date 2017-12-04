import * as DB from "easy-mysql-with-promise";
import * as Promise from "bluebird";

import { IDatabaseController, IDatabaseConnection, throwDatabaseControllerError } from "./common";

import { Bike, Maintenance, Part } from "@shared/types";
import * as validators from "@shared/validators";

export class BikeDatabaseController implements IDatabaseController<Bike> {

    private _db: IDatabaseConnection;

    constructor(connection: IDatabaseConnection) {
        this._db = connection;
    }

    public getSingle(userId: number, id: number): Promise<Bike> {
        /** @todo implement */
        return Promise.resolve(null);
    }

    public getAll(userId: number): Promise<Bike[]> {
        return DB.query('SELECT * FROM bikes WHERE userId = ?', [userId])
            .then((bikes: Bike[]) => this._populateItems(bikes));
    }

    public insert(userId: number, item: Partial<Bike>): Promise<Bike> {
        /** @todo implement */
        return Promise.resolve({} as any);
    }

    public update(userId: number, id: number, item: Partial<Bike>): Promise<Bike> {
        /** @todo implement */
        return Promise.resolve({} as any);
    }

    public delete(userId: number, id: number): Promise<boolean> {
        /** @todo implement */
        return Promise.resolve(true);
    }

    private _populateItems(bikes: Bike[]): Promise<Bike[]> {
        const ids = bikes.map(b => b.id);

        return Promise.all([this._getMaintenances(ids), this._getParts(ids)])
            .then(res => {
                const [maintenances, parts] = res;

                for (let bike of bikes) {
                    bike.maintenances = maintenances.filter(m => m.bikeId === bike.id);
                    bike.parts = parts.filter(p => p.bikeId === bike.id);

                    bike.maintenances.forEach(m => delete m.bikeId);
                    bike.parts.forEach(p => delete p.bikeId);
                }

                return bikes;
            });

    }

    private _getMaintenances(ids: number[]): Promise<Maintenance[]> {
        return DB.query(`SELECT * FROM maintenances WHERE bikeId IN (${ids.join(',')})`, []);
    }

    private _getParts(ids: number[]): Promise<Part[]> {
        return DB.query(`SELECT * FROM parts WHERE bikeId IN (${ids.join(',')})`, []);
    }

}

export const bikeDatabaseController = new BikeDatabaseController(DB);