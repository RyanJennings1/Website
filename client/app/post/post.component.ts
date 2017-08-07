import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Post } from '../_models/index';
import { PostService, AlertService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'post.component.html',
  styleUrls: ['post.component.css'],
})

export class PostComponent implements OnInit{
  id: number;
  private sub: any;
  currentPost: Post;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private alertService: AlertService,
  ) {

  }

  ngOnInit() {
    this.id = (this.route.params as any).value.id;
    this.postService.getById(this.id.toString()).subscribe(
      post => {
        this.currentPost = post;
      },
      error => {
        console.log('error', error);
      }
    );
    this.router.events.subscribe((evnt) => {
      if (!(evnt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0,0);
    });
  }

}
