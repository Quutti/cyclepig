
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

import * as dbRides from './db';

export const all: EndpointHandler = (transaction: Transaction) => {
    dbRides.getRides(transaction.user.id)
        .then(rides => transaction.send.ok(rides))
        .catch(err => handleError(err, transaction));
}

export const add: EndpointHandler = (transaction: Transaction) => {
    console.log(transaction.getBody());
    dbRides.addRide(transaction.user.id, transaction.getBody().ride)
        .then(result => {
            return (result.insertId > -1)
                ? transaction.send.ok({ insertId: result.insertId })
                : transaction.send.badRequest(result.message);
        })
        .catch(err => handleError(err, transaction));
}