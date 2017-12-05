import * as passwd from '../../auth/passwd';
import * as auth from "../../auth/auth";
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';
import { DatabaseControllerCustomError } from "../../database/common";
import { userDatabaseController } from "../../database/users";

export const login: EndpointHandler = (transaction: Transaction) => {

    let { login, password } = transaction.getBody();

    if (!login || !password) {
        return transaction.send.badRequest("Username or password missing");
    }

    userDatabaseController.login(login, password)
        .then(user => {
            transaction.user = user;
            return auth.signJwt(user);
        })
        .then(token => {
            transaction.setSessionCookie(token);
            return transaction.send.ok(transaction.user);
        })
        .catch(err => {
            // We dont want internal error message displayed by
            // DatabaseControllerCustomError to leak to public
            if (err instanceof DatabaseControllerCustomError) {
                transaction.send.unauthorized();
            } else {
                handleError(err, transaction);
            }
        });
}

export const logout: EndpointHandler = (transaction: Transaction) => {
    transaction.removeSessionCookie();
    transaction.send.ok();
}

/** @todo  to be removed, testing only! */
export const createPasswordHash: EndpointHandler = (transaction: Transaction) => {
    passwd.createPasswordHash(transaction.getBody()["password"])
        .then(hash => transaction.send.ok({ hash }));
}