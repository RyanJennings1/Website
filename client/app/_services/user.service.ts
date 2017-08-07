import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    createData = {
      user: {},
      flag: false,
    }
    checkPasswordData = {
        user: {},
        passwordToCheck: "",
    }
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/users/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    getByUsername(username: string) {
        return this.http.get(this.config.apiUrl + '/users/getUsername/' + username, this.jwt());
    }

    create(user: User, flag: boolean) {
        this.createData.user = user;
        this.createData.flag = flag;
        return this.http.post(this.config.apiUrl + '/users/register', this.createData, this.jwt());
    }

    passwordReset(user: User) {
        return this.http.post(this.config.apiUrl + '/users/passwordReset', user, this.jwt());
    }

    update(user: User) {
        return this.http.put(this.config.apiUrl + '/users/' + user._id, user, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/users/' + _id, this.jwt());
    }

    checkPasswords(user: User, password: string) {
        this.checkPasswordData.user = user;
        this.checkPasswordData.passwordToCheck = password;
        return this.http.post(this.config.apiUrl + '/users/password', this.checkPasswordData, this.jwt());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
