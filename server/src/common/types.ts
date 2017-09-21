import * as express from 'express';

export interface Response extends express.Response {
    sendStatusJson(statusCode: number, customProps?: {});
}

export interface Request extends express.Request {
    jwt: string;
}