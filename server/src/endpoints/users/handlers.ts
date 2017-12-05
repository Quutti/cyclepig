
import { EndpointHandler } from '../../common/endpoint-group';
import { Transaction } from '../../common/transaction';
import { handleError } from '../../common/misc';

import { userDatabaseController } from "../../database/users";

export const me: EndpointHandler = (transaction: Transaction) => {
    userDatabaseController.getSingle(transaction.user.id)
        .then(user => user ? transaction.send.ok(user) : transaction.send.unauthorized())
        .catch(err => handleError(err, transaction));
}