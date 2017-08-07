import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService,
         AuthenticationService,
         UserService,
         PostService } from './_services/index';
import { HomeComponent } from './home/index';
import { AdminComponent } from './admin/index';
import { BlogComponent } from './blog/index';
import { NewPostComponent } from './newpost/index';
import { PostComponent } from './post/index';
import { EditPostComponent } from './editpost/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ForgotComponent } from './forgot/index';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        CommonModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        AdminComponent,
        BlogComponent,
        NewPostComponent,
        PostComponent,
        EditPostComponent,
        LoginComponent,
        RegisterComponent,
        ForgotComponent,
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        PostService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
