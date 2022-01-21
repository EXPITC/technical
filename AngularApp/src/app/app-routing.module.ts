import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorDashboardComponent } from './administrator-dashboard/administrator-dashboard.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo:'login',pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  {path:'dashboard', component: AdministratorDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
