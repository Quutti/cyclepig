import * as DB from 'easy-mysql-with-promise';
import * as Promise from 'bluebird';

import * as validators from "@shared/validators";
import { Ride } from "@shared/types";
import * as bikeHelpers from "../bikes/helpers";

export interface AddRideResult {
    insertId: number;
    message?: string;
}

export const getRide = (userId: number, rideId: number): Promise<Ride> => {
    const sql = `
        SELECT r.*
        FROM rides AS r
        INNER JOIN bikes AS b
        ON r.bikeId = b.id
        WHERE b.userId = ?
        AND r.id = ?
    `;

    return DB.query(sql, [userId, rideId])
        .then(res => res[0] || null);
}

export const getRides = (userId: number): Promise<Ride[]> => {
    const sql = `
        SELECT r.* 
        FROM rides AS r
        INNER JOIN bikes AS b
        ON r.bikeId = b.id
        WHERE b.userId = ?
    `;

    return DB.query(sql, [userId]);
}

export const addRide = (userId: number, ride: Ride): Promise<AddRideResult> => {

    const createError = (message: string): AddRideResult => {
        return { insertId: -1, message }
    }

    const validationMessage = validateRide(ride);
    if (validationMessage) {
        return Promise.resolve(createError(validationMessage));
    }

    return bikeHelpers.isUsersBike(userId, ride.bikeId)
        .then(isUsersBike => {
            if (!isUsersBike) {
                return createError("Bike with given id not found");
            }

            // Take only properties that can be added
            const { bikeId, date, distance, description } = ride;
            const newRide = { bikeId, date, distance, description };

            return DB.query(`INSERT INTO rides SET ?`, [newRide])
                .then(res => (res.insertId) ? { insertId: res.insertId } : createError("Adding new bike failed"));
        })
}

const validateRide = (ride: Ride): string => {

    if (!ride || typeof ride !== 'object') {
        return `Request body should have object property ride`;
    }

    const { date, distance, description, bikeId } = ride;

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