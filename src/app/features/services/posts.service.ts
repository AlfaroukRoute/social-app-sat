import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../../core/model/data';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // body ||| url (param , query string ?key=value) || header
  http = inject(HttpClient) ;
  // options = {
  //     headers  :{
  //       AUTHORIZATION : 'Bearer ' + localStorage.getItem('token')
  //     }
  //   }

  // create post
  // formdata JSON
  // body postContent
  // image postimage
  createPost( data  : FormData)  :Observable<any>{
    return this.http.post( 'https://route-posts.routemisr.com/posts' , data )
  } 

  // get post 
   getPosts()  :Observable<IResponse>{
   return this.http.get<IResponse>( 'https://route-posts.routemisr.com/posts'  )
  } 

  // get single post 
    getPostDetails(postID : string)  :Observable<any>{
   return this.http.get( 'https://route-posts.routemisr.com/posts/' + postID  )
  } 

}
