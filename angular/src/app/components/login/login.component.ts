import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { AuthService } from  '../../services/auth.service';
import { HttpClient,HttpHeaders} from '@angular/common/http';

   
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted  =  false;
  error;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder,private http: HttpClient) { }

  get formControls() { return this.loginForm.controls; }


  ngOnInit() {
    
      this.loginForm  =  this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required]
      });

  }

  login(loginvalues){
    const server = "http://localhost:3000/api/auth";
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    console.log(loginvalues);

    this.http
      .post(server,this.loginForm.value,{headers:headers})
      .subscribe(responseData => {
        var res = responseData['token'];
        if(res){
          localStorage.setItem('ACCESS_TOKEN',res);
          this.router.navigateByUrl('/admin');
         }else{
           console.log(responseData)
           this.error = responseData['error'];
         }
      });


    console.log(this.loginForm.value);
    this.isSubmitted = true;
    if(this.loginForm.invalid){
      return;
    }
    
  }
}




