import * as Promise from "bluebird";

import * as db from "./db";

export const isUsersBike = (userId: number, bikeId: number): Promise<boolean> => {
    return db.getBikes(userId)
        .then(bikes => bikes.map(b => b.id).indexOf(bikeId) > -1);
}