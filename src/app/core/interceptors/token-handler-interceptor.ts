import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
// .map 
// .filter
export const tokenHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  // req
  console.log(req , "req from angular app");

  const newReq = req.clone({
    setHeaders : {
       AUTHORIZATION : 'Bearer ' + localStorage.getItem('token')
    }
  })
  
  return next(newReq)
  .pipe(
    // !!!! response
    tap((r)=>{
      console.log("ana response before angular app" , r);
      
    })
  );
};
