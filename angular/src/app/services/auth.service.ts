import { Injectable } from '@angular/core';
import { User } from '../user';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from  '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private router: Router,private http: HttpClient) { }


  public logincheck(userInfo: User){

    const SERVER = "http://localhost:3000/api/auth";
    const headers = new HttpHeaders()
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTdjZjllM2Q1Y2EwNzE4M2M5NDZkZGYiLCJiaXoiOnRydWUsImlhdCI6MTU4NTg0NTg3OH0.pi6XuRbSbK7GI4gxhlRd3v74EH6eUGzF-kz1Kwy5K48')
    .set('Content-Type', 'application/json');

    return this.http
      .post(SERVER,userInfo,{headers:headers})
      .subscribe(responseData => {
        var res = responseData['token'];
        if(res){
          localStorage.setItem('ACCESS_TOKEN',res);
          return res;
          //this.router.navigateByUrl('/admin');
         }else{
           return {"error":"email or password are invalid"}
         }
      });
      
      
  }


  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN') !== null;


  }


  public logout(){
    localStorage.removeItem('ACCESS_TOKEN');
  }
}