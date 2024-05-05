import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth-code.component.html',
  styleUrl: './auth-code.component.css'
})
export default class AuthCodeComponent {
  isformSubmitted: boolean = false;
  email = this.cookies.get('email');
  authCode = this.cookies.get('code');

  authForm = new FormGroup({
    email: new FormControl(this.email, [Validators.required]),
    codigo: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  })

  constructor(private userService: UserService, private router: Router, private cookies: CookieService){}

  onSubmit(){
    const isformSubmitted = this.authForm.valid;
    this.isformSubmitted = true;
    const data = this.authForm.value;
    const codeA = this.authForm.value.codigo;
    
    if(isformSubmitted){
      if(codeA == this.authCode){
        this.userService.authCode(data).subscribe(
          (response) =>{
            this.cookies.set('token', response.token);
            this.cookies.delete('email');
            this.cookies.delete('code');
            this.router.navigateByUrl('/home');
          },
          (error) => {
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
}
