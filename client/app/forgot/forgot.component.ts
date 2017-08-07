import { Component, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

import { User } from '../_models/index';

@Component({
  moduleId: module.id,
  templateUrl: 'forgot.component.html',
})

export class ForgotComponent {
  userToReset: User;
  model: any = {};
  name: string;
  form: FormGroup;
  userDataFromDB: string;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private alertService: AlertService,
    private userService: UserService,
    ) {}

  ngOnInit() {
    this.form = this.fb.group({
      'userName': '',
      'emailAddress': [null, Validators.compose([Validators.required, Validators.pattern('.+')])],
    });
  }

  submitFormData() {
    this.getUsername(this.form.value.userName);
  }

  getUsername(username: string) {
    this.userService.getByUsername(username).subscribe(
      userName => {
        (userName as any)._body = JSON.parse((userName as any)._body);
        this.userDataFromDB = (userName as any)._body;

        if ((this.userDataFromDB as any).email === this.form.value.emailAddress) {
          let text = '';
          let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (let i = 0; i < 20; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }

          this.userService.getById((this.userDataFromDB as any)._id).subscribe(
            user => {
              this.userToReset = user;
              this.userToReset.password = text;
              this.userService.passwordReset(this.userToReset).subscribe(
                data => {
                  this.alertService.success('Email sent', true);
                }, error => {
                  console.log('error', error);
                });
            }
          );
        } else {
          this.alertService.error('Email address doesn\'t match username', true);
        }
      },
      error => {
        console.log('error', error);
      });
  }

  changePassword() {
    this.userService.passwordReset(this.userToReset).subscribe(
      data => {
        //
      }, error => {
        console.log('error', error);
      });
  }

}
