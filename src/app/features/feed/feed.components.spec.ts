import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedComponents } from './feed.components';

describe('FeedComponents', () => {
  let component: FeedComponents;
  let fixture: ComponentFixture<FeedComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
