import * as handlers from './handlers';
import { EndpointGroup, EndpointEntry } from '../../common/endpoint-group';

export default (function () {
    let userEndpoints: EndpointEntry[] = [];

    userEndpoints.push({
        path: 'me',
        handler: handlers.me,
        method: 'get'
    });

    let ep = new EndpointGroup('users', 1);
    ep.addEndpoints(userEndpoints);

    return ep;
})();