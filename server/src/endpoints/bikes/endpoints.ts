import * as handlers from './handlers';
import { EndpointGroup, EndpointEntry } from '../../common/endpoint-group';

export default (function () {
    let endpoints: EndpointEntry[] = [];

    endpoints.push({
        path: '',
        handler: handlers.all,
        method: 'get'
    });

    let ep = new EndpointGroup('bikes', 1);
    ep.addEndpoints(endpoints);

    return ep;
})();