import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError(handleErrorResponse));

  function handleErrorResponse(error: HttpErrorResponse){
    const errorResponse = `${error.error.error}`;
    console.log(errorResponse)
    return throwError(() => errorResponse); 
  }
};
