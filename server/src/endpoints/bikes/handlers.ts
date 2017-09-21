
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

import * as dbBikes from './db';

export const all: EndpointHandler = (transaction: Transaction) => {
    dbBikes.getBikes(transaction.user.id)
        .then(bikes => transaction.send.ok(bikes))
        .catch(err => handleError(err, transaction));
}