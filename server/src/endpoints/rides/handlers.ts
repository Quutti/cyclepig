
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';
import { rideDatabaseController } from "../../database/rides";

import { Ride } from "@shared/types";


export const all: EndpointHandler = (transaction: Transaction) => {
    rideDatabaseController.getAll(transaction.user.id)
        .then(rides => transaction.send.ok(rides))
        .catch(err => handleError(err, transaction));
}

export const one: EndpointHandler = (transaction: Transaction) => {
    const rideId = parseInt(transaction.getParams().rideId, 10);

    rideDatabaseController.getSingle(transaction.user.id, rideId)
        .then(ride => (ride) ? transaction.send.ok(ride) : transaction.send.notFound())
        .catch(err => handleError(err, transaction));
}

export const add: EndpointHandler = (transaction: Transaction) => {
    const ride = transaction.getBody() as Ride;
    if (!ride || typeof ride !== 'object') {
        return transaction.send.badRequest(`Request body should have object property ride`);
    }

    rideDatabaseController.insert(transaction.user.id, ride)
        .then((res) => transaction.send.ok(res))
        .catch((err) => handleError(err, transaction));
}