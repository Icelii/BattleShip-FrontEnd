import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const tokenGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if(userService.getToken()){
    return true;
  }
  else {
    router.navigateByUrl('/login')
    return false
  }
};
