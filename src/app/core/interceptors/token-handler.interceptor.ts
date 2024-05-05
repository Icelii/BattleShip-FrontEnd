import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const tokenHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  let token = userService.getToken();

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
  return next(authReq);
};
