import * as express from 'express';
import { sendStatusJsonMiddleware } from 'send-status-json';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as compression from 'compression';

import { Transaction, prepare } from './common/transaction';
import { registerEndpoints } from './endpoints/endpoints';
import { handleError } from './common/misc';

export class ServerSettings {
    port: number;
}

export const launchServer = (app: express.Application, settings: ServerSettings) => {

    const INDEX_HTML_PATH = (process.env.DEVELOPMENT_MODE)
        ? path.join(__dirname, '..', '..', 'client', 'dist', 'index.html')
        : path.join(__dirname, '..', 'public', 'index.html');

    const ASSETS_PATH = (process.env.DEVELOPMENT_MODE)
        ? path.join(__dirname, '..', '..', 'client', 'dist', 'assets')
        : path.join(__dirname, '..', 'public');

    app.use(compression());

    app.use(sendStatusJsonMiddleware());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use((req, res, next) => {
        if (req.originalUrl.indexOf('js/sw.bundle.js') !== -1) {
            res.setHeader('Service-Worker-Allowed', '/');
        }

        next();
    });

    app.use('/assets', express.static(ASSETS_PATH));

    registerEndpoints(app);

    app.use((req, res, next) => {
        if (req.originalUrl.indexOf('/api/') !== -1) {
            next();
            return;
        }

        res.sendFile(INDEX_HTML_PATH);
    });

    // 404
    app.use(prepare(transaction => {
        let { path, method } = transaction.getRequestInfo();
        console.log(`[404] ${method.toUpperCase()} ${path}`);
        transaction.send.notFound();
    }, false));

    // 500
    app.use((err, req, res, next) => handleError(err, new Transaction(req, res)));

    console.log(`[Listening] ${settings.port}`);
    app.listen(settings.port);
}

