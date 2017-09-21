import * as jwt from 'jsonwebtoken';
import * as dbUsers from '../endpoints/users/db';

export const sign = (payload: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_KEY, {}, (err, hash) => {
            err ? reject(err) : resolve(hash);
        });
    });
}

export const verify = (hash: string): Promise<dbUsers.User> => {
    return new Promise((resolve, reject) => {
        jwt.verify(hash, process.env.JWT_KEY, {}, (err, data) => {
            err ? reject(err) : resolve(data as dbUsers.User);
        });
    });
}