import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { userModel } from './administrator-dashboard.model';

@Component({
  selector: 'app-administrator-dashboard',
  templateUrl: './administrator-dashboard.component.html',
  styleUrls: ['./administrator-dashboard.component.css']
})
export class AdministratorDashboardComponent implements OnInit {

  formValue !: FormGroup;
  userData !: any;
  show !: boolean;
  userModeObject: userModel = new userModel();
  constructor(private formBuilder: FormBuilder, private api : ApiService , private router : Router) { }
  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: [''],
      email: [''],
      phone:[''],
      password: ['']
    })
    this.getUserData()
  }
  logout() {
    localStorage.removeItem("token");
    const token = localStorage.getItem("token") || null;
    if(!token) this.router.navigate(['login'])
  }
  onClickAdd() {
    this.formValue.reset()
    this.show = true;
  }

  postUserData() {
    this.userModeObject.name = this.formValue.value.name;
    this.userModeObject.email = this.formValue.value.email;
    this.userModeObject.phone = this.formValue.value.phone;
    this.userModeObject.password = this.formValue.value.email;
    
    this.api.postUser(this.userModeObject).subscribe(res => {
      // console.log(res)
      console.log(this.userModeObject)
      alert("User Successfully Add")
      const cancel = document.getElementById("cancel")
      cancel?.click()
      this.formValue.reset()
      this.getUserData()
    },
    err=> {
      alert(err.message)
    })
    // console.log('hit')
    // this.formValue.reset;
  }

  getUserData() {
    this.api.getAllUser()
      .subscribe(res => {
        this.userData = res.response;
        console.log(res)
    })
  }
  
  editUser(row: any) {
    this.show = false;
    this.userModeObject.id = row.id;
    this.formValue.controls['name'].setValue(row.name)
    this.formValue.controls['email'].setValue(row.email)
    this.formValue.controls['phone'].setValue(row.phone)
    this.formValue.controls['password'].setValue(row.password)
  }

  updateUserData() {
    this.userModeObject.name = this.formValue.value.name;
    this.userModeObject.email = this.formValue.value.email;
    this.userModeObject.password = this.formValue.value.password;
    console.log(this.userModeObject.id)
    this.api.updateUser(this.userModeObject, this.userModeObject.id)
      .subscribe(res => {
        alert("Successfully Updated User")
        this.getUserData();
        const cancel = document.getElementById("cancel")
        cancel?.click()
        this.formValue.reset()
      })
  }
  deleteUserData(id: number) {
    this.api.deleteUser(id)
      .subscribe(res => {
        alert("Successfully Deleted")
        this.getUserData()
      })
  }

}
