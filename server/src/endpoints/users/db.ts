import * as DB from 'easy-mysql-with-promise';
import * as Promise from 'bluebird';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    createdOn: string;
}

export interface UserRaw extends User {
    passwordHash?: string;
}

export const getUserById = (id: number): Promise<UserRaw> => {
    return DB.query('SELECT * FROM users WHERE id = ?', [id])
        .then(res => res[0] || null);
}

export const getUserByLogin = (login: string): Promise<UserRaw> => {
    return DB.query('SELECT * FROM users WHERE username = ?', [login])
        .then(res => res[0] || null);
}