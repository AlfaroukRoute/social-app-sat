import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardComponents } from './post-card.components';

describe('PostCardComponents', () => {
  let component: PostCardComponents;
  let fixture: ComponentFixture<PostCardComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCardComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
