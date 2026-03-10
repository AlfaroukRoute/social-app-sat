import { Component, inject, OnInit } from '@angular/core';
import { CreatePostComponents } from "../../shared/components/create-post/create-post.components";
import { PostCardComponents } from "../../shared/components/post-card/post-card.components";
import { PostsService } from '../services/posts.service';
import { IPost } from '../../core/model/data';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-feed',
  imports: [CreatePostComponents, PostCardComponents],
  templateUrl: './feed.components.html',
  styleUrl: './feed.components.css',
})
export class FeedComponents implements OnInit {

  postService = inject( PostsService );
  posts : IPost[] = [];

  ngOnInit(): void {
    // this.ngxSpinnerService.show()
    this.postService.getPosts().subscribe({
      next : (r)=>{
        // this.ngxSpinnerService.hide()
       if(r.success ){
        this.posts = r.data.posts ;

       }
        
      },
      error : (err) => {
        // this.ngxSpinnerService.hide()

        console.log(err);
        
      },
    })
  }


}
