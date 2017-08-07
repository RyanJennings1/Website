import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User, Post } from '../_models/index';

@Injectable()
export class PostService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/posts', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/posts/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(post: Post, flag: boolean) {
        let createData = {
            post: post,
            flag: flag,
        }
        return this.http.post(this.config.apiUrl + '/posts/register', createData, this.jwt());
    }

    update(post: Post) {
        return this.http.put(this.config.apiUrl + '/posts/' + post._id, post, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/posts/' + _id, this.jwt());
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
