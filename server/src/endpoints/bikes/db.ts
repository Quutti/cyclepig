import * as DB from 'easy-mysql-with-promise';
import * as Promise from 'bluebird';

export interface Bike {
    id: number;
    name: string;
    added: string;
    maintenances: Maintenance[];
    parts: Part[];
}

export interface Maintenance {
    id: number;
    bikeId?: number;
    title: string;
    description: string;
    date: string;
}

export interface Part {
    id: number;
    bikeId?: number;
    name: string;
    comments: string;
    date: string;
    original: boolean;
    active: boolean;
}

export const getBikes = (userId: number): Promise<Bike[]> => {
    return DB.query('SELECT * FROM bikes WHERE userId = ?', [userId])
        .then((bikes: Bike[]) => {

            const ids = bikes.map(bike => bike.id);

            return Promise.all([getMaintenances(ids), getParts(ids)])
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
        });
}


const getMaintenances = (bikeIds: number[]): Promise<Maintenance[]> => {
    return DB.query(`SELECT * FROM maintenances WHERE bikeId IN (${bikeIds.join(',')})`, []);
}

const getParts = (bikeIds: number[]): Promise<Part[]> => {
    return DB.query(`SELECT * FROM parts WHERE bikeId IN (${bikeIds.join(',')})`, []);
}