import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCardComponents } from './comment-card.components';

describe('CommentCardComponents', () => {
  let component: CommentCardComponents;
  let fixture: ComponentFixture<CommentCardComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCardComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentCardComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
