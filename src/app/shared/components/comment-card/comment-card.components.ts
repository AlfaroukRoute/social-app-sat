import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IComment } from '../../../core/model/data';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { CommentsService } from '../../../features/services/comments.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment-card',
  imports: [],
  templateUrl: './comment-card.components.html',
  styleUrl: './comment-card.components.css',
})
export class CommentCardComponents implements OnInit {
  flowbiteService = inject(FlowbiteService);
  commentService = inject(CommentsService);
    toastr = inject(ToastrService);

  @Input()
  comment : IComment | null = null ;


  @Output()
  onDeleted = new EventEmitter();


  ngOnInit(): void {
     this.flowbiteService.loadFlowbite((flowbite) => {
          initFlowbite(); 
        });
  }


  deleteComment(){
    if(!this.comment?.post ) return ;


    console.log(this.comment?.commentCreator._id);
    // 
    console.log(this.comment?.post);

    this.commentService.deleteComment(this.comment?.post , this.comment?._id  ).subscribe({
      next : (r)=>{
        console.log(r);
        this.onDeleted.emit('deleted');
        this.toastr.success('Delete Successfully' , 'Deleted' )
        // get

        
      },
      error  :(e) =>{
        console.log(e);
        
      }
    })


    

  }

}
