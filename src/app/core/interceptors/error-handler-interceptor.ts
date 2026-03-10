import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

//  301 404 500
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);
  const authservice = inject(AuthService);
  return next(req).pipe(
 
    catchError((e)=>{
      toaster.show(e.error.message);
      switch(e.status) {
        // get posts , get comment , create comment 401
        case 401 :
          authservice.logOut()
      }
      return throwError(()=> e)
      
    })
  );
};
