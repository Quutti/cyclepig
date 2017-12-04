import * as handlers from './handlers';
import { EndpointGroup, EndpointEntry } from '../../common/endpoint-group';

export default (function () {
    let authEndpoints: EndpointEntry[] = [];

    authEndpoints.push({
        path: '',
        handler: handlers.login,
        method: 'post',
        nonAuthorized: true
    });

    authEndpoints.push({
        path: '',
        handler: handlers.logout,
        method: 'delete'
    });

    /** @todo Remove! Testing only */
    authEndpoints.push({
        path: 'pass',
        handler: handlers.createPasswordHash,
        method: 'post',
        nonAuthorized: true
    });

    let ep = new EndpointGroup('auth', 1);
    ep.addEndpoints(authEndpoints);

    return ep;
})();