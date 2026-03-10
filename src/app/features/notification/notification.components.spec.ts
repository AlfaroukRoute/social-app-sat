import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponents } from './notification.components';

describe('NotificationComponents', () => {
  let component: NotificationComponents;
  let fixture: ComponentFixture<NotificationComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
