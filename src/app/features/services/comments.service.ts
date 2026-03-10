import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  // body ||| url (param , query string ?key=value) || header
  http = inject(HttpClient);
  // options = {
  //   headers: {
  //     AUTHORIZATION: 'Bearer ' + localStorage.getItem('token'),
  //   },
  // };



  // ! create Comment 
  // content
  createComment(data : FormData , postId: string): Observable<any>{
   return this.http.post(`https://route-posts.routemisr.com/posts/${postId}/comments` ,data  )
  }

  // ! get post comments
  getPostComment( postId: string): Observable<any>{
   return this.http.get(`https://route-posts.routemisr.com/posts/${postId}/comments` )
  }
  deleteComment( postId: string , commentId : string): Observable<any>{
   return this.http.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}` )
  }

}
