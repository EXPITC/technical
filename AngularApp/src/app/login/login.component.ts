import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { loginModel } from './login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm !: FormGroup
  loginObj: loginModel = new loginModel()
  constructor(private formBuilder : FormBuilder , private router : Router , private api : ApiService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password:['']
    })
    this.checkLogin()
  }
  checkLogin() {
    const token = localStorage.getItem("token") || null;
    if(token) this.router.navigate(['dashboard'])
  }
 
  login() {
    this.loginObj.email = this.loginForm.value.email;
    this.loginObj.password = this.loginForm.value.password;
    console.log(this.loginObj)
    this.api.onlogin(this.loginObj)
      .subscribe(res => {
        this.loginForm.reset()
        localStorage.setItem("token", `${res.token}`);
        res.role === 1 ? this.router.navigate(['dashboard']) : this.router.navigate(['user'])
    },
    err=> {
      alert(err.message)
    })
  }

}
