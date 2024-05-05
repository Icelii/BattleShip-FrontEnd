import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export default class SignUpComponent {
  isformSubmitted: boolean = false;

  signUpForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl("", [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}')]),
    password: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  })

  constructor(private userService: UserService, private router: Router){}

  onSubmit(){
    const isformSubmitted = this.signUpForm.valid;
    this.isformSubmitted = true;
    const userData = this.signUpForm.value;

    if(isformSubmitted){
      console.log(userData);
      this.userService.newUser(userData).subscribe(
        (response) => {
          this.router.navigateByUrl('/login');
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
