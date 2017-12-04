
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

import { bikeDatabaseController } from "../../database/bikes";

export const all: EndpointHandler = (transaction: Transaction) => {
    bikeDatabaseController.getAll(transaction.user.id)
        .then(bikes => transaction.send.ok(bikes))
        .catch(err => handleError(err, transaction));
}