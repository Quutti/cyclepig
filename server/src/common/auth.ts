import * as crypto from 'crypto';

import * as jwt from './jwt';
import * as userHelpers from '../endpoints/users/helpers';
import * as dbUsers from '../endpoints/users/db';

/**
 *  Defaults for PW hashing 
 */
const DEFAULT_ITERATIONS = 50000;
const DEFAULT_DIGEST = 'sha512';
const DEFAULT_HASH_BYTES = 128;
const EXTRA_BYTES = 12;

export const login = (login: string, password: string): Promise<dbUsers.User> => {
    let user: dbUsers.User;
    return new Promise((resolve, reject) => {
        dbUsers.getUserByLogin(login)
            .then(rawUser => {
                if (rawUser) {
                    user = userHelpers.cleanSensitiveData(rawUser);
                    return verifyPassword(password, rawUser.passwordHash);
                } else {
                    reject(null);
                }
            })
            .then((ok: boolean) => ok ? resolve(userHelpers.cleanSensitiveData(user)) : reject(null))
            .catch(err => reject(err));
    });
};

export const checkAuth = (token: string): Promise<dbUsers.User> => {
    return jwt.verify(token || '');
}

/**
 * Generates base64 encoded string from password with unique salt in it
 * @param password
 */
export const createPasswordHash = (password: string): Promise<string> => {

    const HASH_BYTES = parseInt(process.env.PASSWORD_HASH_BYTES, 10) || DEFAULT_HASH_BYTES;
    const SALT_BYTES = parseInt(process.env.PASSWORD_SALT_BYTES, 10) || DEFAULT_HASH_BYTES;
    const DIGEST = process.env.PASSWORD_DIGEST || DEFAULT_DIGEST;
    const ITERATIONS = parseInt(process.env.PASSWORD_ITERATION_COUNT, 10) || DEFAULT_ITERATIONS;
    const SYSTEM_SALT = process.env.PASSWORD_SYSTEM_SALT || '';

    console.log(ITERATIONS);

    return new Promise((resolve, reject) => {
        crypto.randomBytes(SALT_BYTES, (err, salt: Buffer) => {
            if (err) {
                return reject(err);
            }

            // Add some system salt to the soup
            let combinedSalt = Buffer.concat([
                salt,
                Buffer.from(SYSTEM_SALT)
            ]);

            crypto.pbkdf2(
                password,
                combinedSalt,
                ITERATIONS,
                HASH_BYTES,
                DIGEST,
                (err, hash: Buffer) => {
                    if (err) {
                        return reject(err);
                    }

                    let final = new Buffer(hash.length + salt.length + DIGEST.length + EXTRA_BYTES)

                    // Save information about salt length, digest string length 
                    // and iteration count to the beginning of the hash
                    final.writeUInt32BE(salt.length, 0, true);
                    final.writeUInt32BE(ITERATIONS, 4, true);
                    final.writeUInt32BE(DIGEST.length, 8, true);

                    // Copy salt and hash to the buffer
                    salt.copy(final, EXTRA_BYTES);
                    hash.copy(final, salt.length + EXTRA_BYTES);

                    // Write used digest method
                    final.write(DIGEST, hash.length + salt.length + EXTRA_BYTES);

                    // Resolve as base64 encoded string
                    resolve(final.toString('base64'));
                });
        });
    });
}

/**
 * Verifies that given password is the same that passed passwordHash was generated with
 * @param password
 * @param passwordHash
 */
export const verifyPassword = (password: string, passwordHash: string): Promise<boolean> => {

    console.log(password, passwordHash);

    const SYSTEM_SALT = process.env.PASSWORD_SYSTEM_SALT || '';

    return new Promise((resolve, reject) => {

        // anatomy of passwordHash:
        // saltLen|iterationCount|digestLen|salt|passwdhash|digestStr

        // Read passwordHash to the buffer
        let buffer = Buffer.from(passwordHash, 'base64');

        // We don't use PW_ constants here so we won't mess up
        // the existing passwords if constants are changed
        let saltBytes = buffer.readUInt32BE(0);
        let iterations = buffer.readUInt32BE(4);
        let digestBytes = buffer.readInt32BE(8);
        let hashBytes = buffer.length - saltBytes - EXTRA_BYTES - digestBytes;

        let saltEnd = saltBytes + EXTRA_BYTES;
        let hashEnd = saltEnd + hashBytes;

        let salt = buffer.slice(EXTRA_BYTES, saltEnd);
        let currentPasswordHash = buffer.toString('binary', saltEnd, hashEnd);
        let digest = buffer.slice(hashEnd).toString();

        let combinedSalt = Buffer.concat([
            salt,
            Buffer.from(SYSTEM_SALT)
        ]);

        crypto.pbkdf2(
            password,
            combinedSalt,
            iterations,
            hashBytes,
            digest,
            (err: Error, hash: Buffer) => {
                (err)
                    ? reject(err)
                    // Return boolean true if binaries matches, false if not
                    : resolve(hash.toString('binary') === currentPasswordHash);
            });
    });
}