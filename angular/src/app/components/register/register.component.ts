import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { HttpClient,HttpHeaders} from '@angular/common/http';

import { Router } from  '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  file:File;
  error;
uploadForm: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder,private http: HttpClient) { }
  form: FormGroup;
  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      name: '',
      username: '',
      image: '',
      email: '',
      password: ''
    });
  }

  selectedimage(event){
    if(event.target.files.length>0){
      this.file = event.target.files[0];
      this.uploadForm.get('image').setValue(this.file);
      console.log(this.file.name);
      console.log(this.uploadForm.get('image').value)
    }
  }
  register(registervalue){
    const server = "http://localhost:3000/api/users";
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    ;
    const fd = new FormData();
     fd.append('image',this.file,this.file.name);
    fd.append('name',registervalue.name);
    fd.append('username',registervalue.username);
    fd.append('email',registervalue.email);
    fd.append('password',registervalue.password);
    console.log(fd)

    this.http
      .post<any>(server,fd)
      .subscribe(responseData => {
        console.log(responseData);
        var res = responseData['success'];
        if(res){
          this.router.navigateByUrl('/login');
        }else{
            console.log(responseData)
            this.error = responseData['error'];
        }
      });


  console.log(registervalue);
  }

}
