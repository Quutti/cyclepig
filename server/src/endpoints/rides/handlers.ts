
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

import * as dbRides from './db';

export const all: EndpointHandler = (transaction: Transaction) => {
    dbRides.getRides(transaction.user.id)
        .then(rides => transaction.send.ok(rides))
        .catch(err => handleError(err, transaction));
}