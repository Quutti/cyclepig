import * as auth from '../../common/auth';
import * as jwt from '../../common/jwt';
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

export const login: EndpointHandler = (transaction: Transaction) => {

    let { login, password } = transaction.getBody();

    if (!login || !password) {
        return transaction.send.badRequest("Username or password missing");
    }

    auth.login(login, password)
        .then(user => {
            transaction.user = user;
            return jwt.sign(user);
        })
        .then(token => {
            transaction.setSessionCookie(token);
            return transaction.send.ok(transaction.user);
        })
        .catch(err => {
            if (err) {
                handleError(err, transaction);
            } else {
                transaction.send.unauthorized();
            }
        });
}

export const logout: EndpointHandler = (transaction: Transaction) => {
    transaction.removeSessionCookie();
    transaction.send.ok();
}

/* testing only! */
export const createPasswordHash: EndpointHandler = (transaction: Transaction) => {
    auth.createPasswordHash(transaction.getBody()["password"])
        .then(hash => transaction.send.ok({ hash }));
}