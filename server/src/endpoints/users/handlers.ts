
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

import * as helpers from './helpers';
import * as dbUsers from './db';

export const me: EndpointHandler = (transaction: Transaction) => {
    dbUsers.getUserById(transaction.user.id)
        .then(rawUser => {
            rawUser
                ? transaction.send.ok(helpers.cleanSensitiveData(rawUser))
                : transaction.send.unauthorized();
        })
        .catch(err => handleError(err, transaction));
}