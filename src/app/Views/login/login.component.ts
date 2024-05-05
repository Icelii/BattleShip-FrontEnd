import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  isformSubmitted: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}')]),
    password: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  })

  constructor(private userService: UserService, private router: Router, private cookies: CookieService){}

  onSubmit(){
    const isformSubmitted = this.loginForm.valid;
    this.isformSubmitted = true;
    const userData = this.loginForm.value;
    if(isformSubmitted){
      this.userService.login(userData).subscribe(
        (response) => {
          this.cookies.set('code', response.user.codigo);
          this.cookies.set('email', response.user.email);
          this.router.navigateByUrl('/auth-code');
        },
        (error) =>{
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      )
    }
  }
}
