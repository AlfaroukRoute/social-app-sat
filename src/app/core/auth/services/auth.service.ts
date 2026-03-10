import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  routerS = inject(Router)
  private http = inject(HttpClient);


  register(data: {
    name: string;
    username: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    password: string;
    rePassword: string;
  }):Observable <any> {
   return this.http.post('https://route-posts.routemisr.com/users/signup' , data );
  }

   login(data: {
    email: string;
    password: string;
  }):Observable <any> {
   return this.http.post('https://route-posts.routemisr.com/users/signin' , data );
  }


  logOut(){
    
    localStorage.removeItem('token') ;
    this.routerS.navigate(['/auth/login'])

  }
}
