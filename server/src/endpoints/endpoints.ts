import * as express from 'express';

import auth from './auth/endpoints';
import users from './users/endpoints';

import bikes from "./bikes/endpoints";
import rides from "./rides/endpoints";

const endpointGroups = [
    auth,
    users,
    bikes,
    rides
];

export const registerEndpoints = (app: express.Application) => {
    endpointGroups.forEach(epg => {
        epg.register(app);
    });
}