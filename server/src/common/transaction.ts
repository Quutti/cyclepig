import * as express from 'express';

import { EndpointHandler } from './endpoint-group';
import { User } from "../database/users";
import * as auth from "../auth/auth";
import * as types from './types';
import { Profiler } from './profiler';

const SESSION_COOKIE_EXPIRE_MS = 1000 * 60 * 60 * 24 * 7;

export const prepare = (handler: EndpointHandler, authrozedOnly: boolean = true): express.RequestHandler => {
    return (req: types.Request, res: types.Response) => {
        let transaction = new Transaction(req, res);
        if (authrozedOnly) {
            auth.checkAuth(req.cookies['cyclepig-session-token'])
                .then(user => {
                    transaction.user = user;
                    try {
                        handler(transaction);
                    } catch (e) {
                        console.error(e);
                        transaction.send.internalServerError();
                    }
                })
                .catch(() => transaction.send.unauthorized());
        } else {
            handler(transaction);
        }
    }
}

export interface TransactionRequestInfo {
    path: string;
    method: string;
}

export class Transaction {

    public send: ResponseHelpers;

    private _profiler: Profiler = null;
    private _req: types.Request;
    private _res: types.Response;
    public user: User = null;

    constructor(request: types.Request, response: types.Response) {
        this._req = request;
        this._res = response;


        this._profiler = new Profiler(console);

        this.send = new ResponseHelpers(this._res, () => {
            if (process.env.DEVELOPMENT_MODE) {
                this._profiler.stop(`Transaction ${this._req.originalUrl}`);
            }
        });

        if (process.env.DEVELOPMENT_MODE) {
            this._profiler.start(`Transaction ${this._req.originalUrl}`);
        }
    }

    public getRequestInfo(): TransactionRequestInfo {
        return {
            path: this._req.originalUrl,
            method: this._req.method
        }
    }

    public getParams(): { [key: string]: string } {
        return this._req.params;
    }

    public getBody(): { [key: string]: any } {
        return this._req.body;
    }

    public setSessionCookie(token: string) {
        this._res.cookie('cyclepig-session-token', token, {
            path: '/',
            expires: new Date(new Date().valueOf() + SESSION_COOKIE_EXPIRE_MS),
            httpOnly: true,
            secure: !process.env.DEVELOPMENT_MODE
        });
    }

    public removeSessionCookie() {
        this._res.clearCookie('cyclepig-session-token');
    }

    public profileStep(msg: string) {
        if (this._profiler) {
            this._profiler.step(msg);
        }
    }
}

class ResponseHelpers {

    private _res: types.Response;
    private _onAfterSend: Function;

    constructor(expressResponse: types.Response, onAfterSend: Function) {
        this._res = expressResponse;
        this._onAfterSend = onAfterSend;
    }

    public custom(statusCode: number, payload: {}) {
        this._send(statusCode, payload ? { payload } : undefined);
    }

    public ok(payload?: { [key: string]: any }) {
        this._send(200, payload ? payload : undefined);
    }

    public created() {
        this._send(201);
    }

    public noContent() {
        this._send(204);
    }

    public badRequest(message?: string) {
        this._send(400, message ? { message } : undefined);
    }

    public unauthorized() {
        this._send(401);
    }

    public forbidden() {
        this._send(403)
    }

    public notFound() {
        this._send(404);
    }

    public internalServerError() {
        this._send(500);
    }

    private _send(statusCode: number, payload?: { [key: string]: any }) {
        this._res.sendStatusJson(statusCode, payload ? { payload } : undefined);
        this._onAfterSend();
    }

}
