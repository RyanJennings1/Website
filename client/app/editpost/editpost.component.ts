import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';

import { User, Post } from '../_models/index';
import { PostService, AlertService, UserService } from '../_services/index';

@Component ({
  moduleId: module.id,
  templateUrl: 'editpost.component.html',
  styleUrls: ['editpost.component.css'],
})

export class EditPostComponent implements OnInit{
  id: number;
  private sub: any;
  currentPost: Post;
  model: any = {};
  image: any;
  form: FormGroup;
  loggedInUser: User;
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private alertService: AlertService,
    private userService: UserService,
    public fb: FormBuilder,
  ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loadCurrentUser();
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
    this.form = this.fb.group({
      'title': '',
      'text': '',
      'image': ''
    });
  }

  loadCurrentUser() {
      this.userService.getById(this.currentUser._id).subscribe(
          user => {
              this.loggedInUser = user;
          },
          error => {
              console.log('error', error);
          });
  }

  submitFormData() {
    this.currentPost.image = this.form.value.image;
    this.postService.update(this.currentPost).subscribe(
      data => {
        this.alertService.success('Post updated', false);
        console.log('data', data);
      },
      error => {
        console.log('error', error);
      }
    );
  }

  changeListener($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
      this.form.value.image = myReader.result;
      console.log('here: ', myReader.result);
    }
    myReader.readAsDataURL(file);
  }

}