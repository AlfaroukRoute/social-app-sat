import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PATTERNS } from '../../../../shared/util/validationPatterns';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Langs, NgxTranslateService } from '../../services/ngx-translate.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule , TranslatePipe],
  templateUrl: './login.components.html',
  styleUrl: './login.components.css',
})
export class LoginComponents {
  // input formController
  // [input , input , input] {input.Fname , input.LastName}
  //  formArray , 
  //                    formGroup

  authS = inject(AuthService);
  routerS = inject(Router);
  ngxTranslateS = inject(NgxTranslateService);
  formBuilder = inject(FormBuilder);
  errorMsg = '' ;
  loading = false ;
  value = "ahmed" ;


  loginForm : FormGroup = this.formBuilder.group({
    email : ['' , [Validators.required , Validators.email]],
    password  : ['' , [Validators.required , Validators.pattern(PATTERNS.password) ]]
  })

 


 
  login(){
    // reset error msg 
    this.errorMsg = '';
    
     
    // login
    if( this.loginForm.valid  ){
      this.loading = true ;
      this.authS.login(this.loginForm.value )
        .subscribe({
          next : (r) =>{
             this.loading = false ;
            console.log(r);
            if(r.data.token) {
              // !!!
               localStorage.setItem('token' , r.data.token)
              this.routerS.navigate(['/main/feed'])
            }
            // token
          } ,
          // error msg 
          error : (e) =>{
             this.loading = false ;
             this.errorMsg =(e.error.message);
          } ,
        })
    }
    
  }

  swicthLang(lang: Langs) {
this.ngxTranslateS.useLanguage(lang)
  }


}
