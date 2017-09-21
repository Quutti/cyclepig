import * as express from 'express';
import * as transaction from './transaction';

export type EndpointVerbs = "get" | "post" | "put" | "delete";

export type EndpointHandler = (transaction: transaction.Transaction) => any;

export interface EndpointEntry {
    path: string;
    method: EndpointVerbs;
    handler: EndpointHandler;
    nonAuthorized?: boolean;
}

export class EndpointGroup {

    private _name: string;
    private _versionNumber: number;
    private _endpoints: EndpointEntry[] = [];

    public versionedPath: boolean = true;

    constructor(name: string, version: number) {
        this._name = name;
        this._versionNumber = version;
    }

    public addEndpoints(entries: EndpointEntry[]) {
        let paths = this._endpoints.map(ep => ep.method + ep.path);

        entries.forEach(ep => {
            if (paths.indexOf(ep.method + ep.path) > -1) {
                throw 'Path should not be registered twice';
            }

            paths.push(ep.method + ep.path);
            this._endpoints.push(ep);
        })
    }

    public register(app: express.Application) {
        for (let ep of this._endpoints) {
            let authorizedOnly = !ep.nonAuthorized;
            let path = this._buildPath(ep.path);

            console.log(`[RegEndpoint]: ${ep.method.toUpperCase()} ${path}`)

            app[ep.method as string](
                path,
                transaction.prepare(ep.handler, authorizedOnly)
            );
        }
    }

    private _buildPath(path: string): string {
        let parts: string[] = [];

        parts.push('api');

        if (this.versionedPath) {
            parts.push('v' + this._versionNumber);
        }

        parts.push(this._name);
        path.split('/').forEach(p => {
            if (p) {
                parts.push(p);
            }
        });

        return '/' + parts.join('/');
    }

}