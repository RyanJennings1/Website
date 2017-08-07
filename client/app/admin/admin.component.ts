import { Component, NgModule } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

import { User, Post } from '../_models/index';
import { AlertService, UserService, PostService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})

export class AdminComponent {
  posts: Post[] = [];
  loggedInUser: User;
  currentUser: User;

  constructor(
    private userService: UserService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private postService: PostService,   
  ) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.loadCurrentUser();
      this.loadAllPosts();
  }

  loadCurrentUser() {
    this.userService.getById(this.currentUser._id).subscribe(user => {
      this.loggedInUser = user;
    });
  }

  loadAllPosts() {
    this.postService.getAll().subscribe(
      returnedPosts => {
        this.posts = returnedPosts;
      },
      error => {
        console.log('error', error);
      }
    )
  }

  deletePost(_id: string) {
    this.postService.delete(_id).subscribe(
      data => {
        this.loadAllPosts();
        this.alertService.success('Post successfully deleted', false);
      },
      error => {
        console.log('error', error);
      }
    )
  }

}
