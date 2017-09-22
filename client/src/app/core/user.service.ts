import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response } from "@angular/http";

import 'rxjs/add/operator/toPromise';

const LOGGEDIN_INFORMATION_REQUEST_INTERVAL = 1000 * 60; // 30 sek

interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
}

@Injectable()
export class UserService {

    public loginStatusBroadcast = new EventEmitter<boolean>()
    private _user: User = null;

    constructor(private _http: Http) { }

    public getUser(): Promise<User> {
        if (this._user) {
            this.loginStatusBroadcast.emit(true);
            return Promise.resolve(this._user);
        } else {
            return this._http.get('/api/v1/users/me')
                .toPromise()
                .then(res => {
                    this.loginStatusBroadcast.emit(true);
                    return res.json().payload
                })
                .catch(err => {
                    this.loginStatusBroadcast.emit(false);
                    Promise.reject(err)
                });
        }
    }

    public login(login: string, password: string): Promise<void> {
        return this._http.post('/api/v1/auth', { login, password })
            .toPromise()
            .then(res => {
                if (res.status === 200) {
                    this._user = res.json().payload;
                    this.loginStatusBroadcast.emit(true);
                    return Promise.resolve();
                } else {
                    return Promise.reject(null);
                }
            })
            .catch(err => Promise.reject(err));
    }

    public logout(): Promise<void> {
        return this._http.delete('/api/v1/auth')
            .toPromise()
            .then(res => {
                this.loginStatusBroadcast.emit(false);
                return;
            });
    }


}