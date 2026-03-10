import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../../features/services/posts.service';

@Component({
  selector: 'app-create-post',
  imports: [PickerComponent, ReactiveFormsModule],
  templateUrl: './create-post.components.html',
  styleUrl: './create-post.components.css',
  standalone: true,
})
export class CreatePostComponents {
  formBuilder = inject(FormBuilder);
  postsService = inject(PostsService);

  showPicker = false;

  // to back end
  selectImg: File | null = null;
  // to preview to user
  imgSrc = '';

  createPostForm: FormGroup = this.formBuilder.group({
    privacy: ['public', [Validators.required]],
    body: ['', [Validators.required]],
  });

  handleUploadPostImgChange(e: any) {
    if (e.target.files?.length > 0) {
      this.selectImg = e.target.files[0];
      this.imgSrc = URL.createObjectURL(e.target.files[0]);
    }
  }

  removeImg() {
    this.selectImg = null;
    this.imgSrc = '';
  }

  handleEmojiSelected(e: any) {
    // console.log();
    const olldValue = this.createPostForm.get('body')?.value;
    this.createPostForm.get('body')?.setValue(olldValue + e.emoji.native);
  }

  createPost() {
    if (!this.selectImg) return;

    const formData = new FormData();
    formData.append('body', this.createPostForm.value.body);
    formData.append('image', this.selectImg);
    this.postsService.createPost(formData)
      .subscribe({
        next : ()=>{
          this.removeImg() ;
          this.createPostForm.get('body')?.setValue('')
        }
      })
      
  }
}
