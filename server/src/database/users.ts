import * as DB from "easy-mysql-with-promise";
import * as Promise from "bluebird";

import { IDatabaseConnection, throwDatabaseControllerError } from "./common";
import * as passwd from "../auth/passwd";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    createdOn: string;
}

interface UserRaw extends User {
    passwordHash?: string;
}

export class UserDatabaseController {

    private _db: IDatabaseConnection;
    private _passwd: passwd.IPassword;

    constructor(connection: IDatabaseConnection, passwd: passwd.IPassword) {
        this._db = connection;
        this._passwd = passwd;
    }

    public getSingle(userId: number): Promise<User> {
        return this._db.query('SELECT * FROM users WHERE id = ?', [userId])
            .then((res: UserRaw[]) => {
                return (res[0]) ? this._cleanSensitiveData(res[0] as UserRaw) : null;
            });
    }

    public login(login: string, password: string): Promise<User> {
        let user: User;

        return this._getSingleByLogin(login)
            .then((u: UserRaw) => {
                if (!u) {
                    throwDatabaseControllerError(`User with login "${login} not found"`);
                }

                user = u;
                return this._passwd.verifyPassword(password, u.passwordHash);
            })
            .then((ok: boolean) => {
                if (!ok) {
                    throwDatabaseControllerError(`Password missmatch "${login}"`);
                }
                return this._cleanSensitiveData(user);
            })
            .catch(err => Promise.reject(err));
    }

    private _cleanSensitiveData(user: UserRaw): User {
        const u: UserRaw = { ...user };
        delete u.passwordHash;
        return u;
    }

    private _getSingleByLogin(login: string): Promise<UserRaw> {
        return this._db.query('SELECT * FROM users WHERE username = ?', [login])
            .then(res => res[0] || null);
    }

}

export const userDatabaseController = new UserDatabaseController(DB, passwd);