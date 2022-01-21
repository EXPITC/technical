import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  onlogin(data: any) {
    return this.http.post<any>("http://localhost:5000/v1/login", data)
      .pipe(map((res: any) => {
        return res
      }))
  }
  
  postUser(data: any) {
    return this.http.post<any>("http://localhost:5000/v1/create/user", data, { headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")};}`
    } })
      .pipe(map((res:any) => {
        return res;
      }))
  }

  getAllUser() {
    return this.http.get<any>("http://localhost:5000/v1/list/user")
      .pipe(map((res: any) => {
        return res;
    }))
  }

  updateUser(data:any ,id: number) {
    return this.http.put<any>(`http://localhost:5000/v1/update/user/${id}` , data , {headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")};}`
    } })
    // return this.http.patch<any>(`http://localhost:5000/v1/update/user/${id}` , data )
  }

  deleteUser(id: number) {
    return this.http.delete(`http://localhost:5000/v1/del/user/${id}`)
  }
}
