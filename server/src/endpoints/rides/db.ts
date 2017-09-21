import * as DB from 'easy-mysql-with-promise';
import * as Promise from 'bluebird';

export interface Ride {
    id: number;
    bikeId: number;
    distance: number
    description: string;
    date: string;
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