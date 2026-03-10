import { Component, inject } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from "@angular/router";
import { PATTERNS } from '../../../../shared/util/validationPatterns';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.components.html',
  styleUrl: './register.components.css',
})
export class RegisterComponents {


  authService  = inject(AuthService);
  routerService  = inject(Router);
  isLoading = false ;
  errorMsg = '';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }


  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required , Validators.minLength(5)]),
    username: new FormControl('ahmed', [Validators.required , Validators.pattern(/^[a-z0-9_]{3,30}$/)]),
    email: new FormControl(null, [Validators.required , Validators.email]),
    gender: new FormControl('female', [Validators.required]),
    dateOfBirth: new FormControl(null, [Validators.required] ),

    // 
    password: new FormControl(null, [Validators.required , Validators.pattern(PATTERNS.password)]),
    // custom validation 
    rePassword: new FormControl(null, [Validators.required ]),
  }, {
    validators : [this.mismatch]
  });

  // 
  mismatch(group : AbstractControl){
    const password = group.get('password');
    const rePassword = group.get('rePassword');

    if(  password?.value != rePassword?.value ) {
      // 
      rePassword?.setErrors({
          mismatch : true
      })
      return {
        mismatch : true
      }
    }else {
      return null
    }
  }

  

  register(){
    this.registerForm.markAllAsTouched();
     this.errorMsg = ''
    
    
    if( this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.isLoading = true ;
      this.authService.register(this.registerForm.value).subscribe({
        next  : (r)=>{

        
          this.isLoading = false ;
          if(r.data.token) {
            localStorage.setItem('token' , r.data.token)
            this.routerService.navigate(['/main/feed' ])
          }
          // ! reg ,  
          // ! 
          
        },
          error : (e)=>{
            console.log();
            this.errorMsg = e.error.errors;
          this.isLoading = false ;
          
        }
      })
      

    }
    
  }
}
