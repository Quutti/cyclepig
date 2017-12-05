import * as jwt from 'jsonwebtoken';

import * as passwd from "./passwd";
import { User } from "../database/users";

export const signJwt = (payload: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_KEY, {}, (err, hash) => {
            err ? reject(err) : resolve(hash);
        });
    });
}

export const verifyJwt = (hash: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        jwt.verify(hash, process.env.JWT_KEY, {}, (err, data) => {
            err ? reject(err) : resolve(data as User);
        });
    });
}

export const checkAuth = (token: string): Promise<User> => {
    return verifyJwt(token || '');
}