import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { AdminComponent } from './admin/index';
import { BlogComponent } from './blog/index';
import { NewPostComponent } from './newpost/index';
import { PostComponent } from './post/index';
import { EditPostComponent } from './editpost/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ForgotComponent } from './forgot/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'admin', component: AdminComponent , canActivate: [AuthGuard]},
    { path: 'blog', component: BlogComponent },
    { path: 'new-post', component: NewPostComponent, canActivate: [AuthGuard] },
    { path: 'post/:id', component: PostComponent },
    { path: 'edit-post/:id', component: EditPostComponent, canActivate: [AuthGuard] },
    { path: 'forgot', component: ForgotComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
