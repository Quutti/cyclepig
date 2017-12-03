import * as handlers from './handlers';
import { EndpointGroup, EndpointEntry } from '../../common/endpoint-group';

export default (function () {
    let endpoints: EndpointEntry[] = [];

    endpoints.push({
        path: '',
        handler: handlers.all,
        method: 'get'
    });

    endpoints.push({
        path: ':rideId',
        handler: handlers.one,
        method: "get"
    })

    endpoints.push({
        path: "",
        handler: handlers.add,
        method: "post"
    })

    let ep = new EndpointGroup('rides', 1);
    ep.addEndpoints(endpoints);

    return ep;
})();