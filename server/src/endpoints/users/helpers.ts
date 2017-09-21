import * as dbUsers from './db';

export const cleanSensitiveData = (rawUser: dbUsers.UserRaw): dbUsers.User => {
    let user = { ...rawUser };
    delete user.passwordHash;
    return user as dbUsers.User;
}
