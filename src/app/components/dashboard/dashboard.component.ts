import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loginUsuario : FormGroup;
 
  
  constructor(private fb: FormBuilder,
              private afAuth : AngularFireAuth,
              private routes: Router,
              private toastr: ToastrService) {   
    this.loginUsuario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })
}

  ngOnInit(): void {
  }

  login(){
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;

    this.afAuth.signInWithEmailAndPassword(email, password).then((user)=>{
      console.log(user);
      if(user.user){
        this.routes.navigate(['/ListarProductosComponent'])
        localStorage.setItem('token', JSON.stringify(user));
      }else{
        this.toastr.error('El usuario no esta registrado', 'Error');
      }
    }).catch((error)=>{
      this.toastr.error('El usuario no esta registrado', 'Error');
    }) 
  }
}
