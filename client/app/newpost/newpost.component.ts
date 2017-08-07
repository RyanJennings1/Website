import { Component, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User, Post } from '../_models/index';
import { AlertService, UserService, PostService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'newpost.component.html',
    styleUrls: ['newpost.component.css'],
})

export class NewPostComponent {
  post: Post;
  model: any = {};
  image: any;
  form: FormGroup;
  loggedInUser: User;
  currentUser: User;

  constructor(
    private userService: UserService,
    public fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private postService: PostService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.loadCurrentUser();
  }

  ngOnInit() {
    this.form = this.fb.group({
      'title': '',
      'text': '',
      'image': ''
    });
  }

  submitFormData() {
    let timestamp = new Date(Date.now());
    this.form.value.date = timestamp.getFullYear().toString() + '/' +
      (+timestamp.getMonth().toString() + 1).toString() + '/' + 
      timestamp.getDate().toString();
    this.form.value.seconds = Date.now();
    console.log('form value: ', this.form.value);
    this.postService.create(this.form.value, true).subscribe(
      res => {
        this.alertService.success('Post created', false);
        this.router.navigate(['/admin']);
        console.log('Response', res);
      },
      error => {
        console.log('error', error);
      }
    )
  }

  loadCurrentUser() {
    this.userService.getById(this.currentUser._id)
      .subscribe(user => {
        this.loggedInUser = user;
      },
      error => {
        console.log('error', error);
      });
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
