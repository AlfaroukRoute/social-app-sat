import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loaderHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  // show
  // 
   const ngxSpinnerService = inject( NgxSpinnerService );
  //  
   if(!req.url.includes('comment')) {
     ngxSpinnerService.show()

   }


  return next(req)
  .pipe(finalize(()=>{
    // hide
    if(!req.url.includes('comment')) {
      ngxSpinnerService.hide()

    }
  }));
};
