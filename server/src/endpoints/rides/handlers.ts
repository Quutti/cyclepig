
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

import { Ride } from "@shared/types";
import * as dbRides from './db';

export const all: EndpointHandler = (transaction: Transaction) => {
    dbRides.getRides(transaction.user.id)
        .then(rides => transaction.send.ok(rides))
        .catch(err => handleError(err, transaction));
}

export const one: EndpointHandler = (transaction: Transaction) => {
    const rideId = parseInt(transaction.getParams().rideId, 10);
    dbRides.getRide(transaction.user.id, rideId)
        .then(ride => (ride) ? transaction.send.ok(ride) : transaction.send.notFound())
        .catch(err => handleError(err, transaction));
}

export const add: EndpointHandler = (transaction: Transaction) => {
    dbRides.addRide(transaction.user.id, transaction.getBody() as Ride)
        .then(result => {
            return (result.insertId > -1)
                ? transaction.send.ok({ insertId: result.insertId })
                : transaction.send.badRequest(result.message);
        })
        .catch(err => handleError(err, transaction));
}