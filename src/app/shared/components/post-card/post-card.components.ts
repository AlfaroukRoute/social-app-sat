import { Component, inject, Input } from '@angular/core';
import { IComment, IPost } from '../../../core/model/data';
import { CommentCardComponents } from '../comment-card/comment-card.components';
import { CommentsService } from '../../../features/services/comments.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-card',
  imports: [CommentCardComponents , ReactiveFormsModule],
  templateUrl: './post-card.components.html',
  styleUrl: './post-card.components.css',
})
export class PostCardComponents {
  comments: IComment[] = [];
  @Input()
  post: IPost | null = null;
  commentService = inject(CommentsService);
  formBuilder = inject(FormBuilder);

  commentCreateForm : FormGroup = this.formBuilder.group({
    content : ['' , [Validators.required]]
  });

  getPostComments() {
    if (!this.post?._id) return;

    this.commentService.getPostComment(this.post?._id).subscribe({
      next  :(r) =>{
        console.log(r);
       this.comments =  r.data.comments ;
        
      },
      error  :(e)=>{
        console.log(e);
        
      }
    })
  }

  createComment(){
    if(!this.post?._id) return ;

    const data = new FormData();
    data.append('content' , this.commentCreateForm.value.content)
    
    this.commentService.createComment(data , this.post?._id)
      .subscribe({
        next : (r)=>{
          console.log(r);
          if(r.success) {
            this.post!.commentsCount += 1 ;

          }
          
        },
        error  :(e)=>{
          console.log(e);
          
        }
      })
  }

  handleDelete(){
    console.log('hii');
    
    this.getPostComments()
  }
}
