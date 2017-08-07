import { Component, NgModule } from '@angular/core';

import { Post } from '../_models/index';
import { AlertService, PostService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'blog.component.html',
    styleUrls: ['blog.component.css'],
})

export class BlogComponent {
  posts: Post[] = [];

  constructor(
    private alertService: AlertService,
    private postService: PostService) {
      this.loadAllPosts();
  }

  loadAllPosts() {
    this.postService.getAll().subscribe(
      data => {
        this.posts = data;
      },
      error => {
        console.log('error', error);
      }
    )
  }


}
