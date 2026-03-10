import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordComponents } from './forget-password.components';

describe('ForgetPasswordComponents', () => {
  let component: ForgetPasswordComponents;
  let fixture: ComponentFixture<ForgetPasswordComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPasswordComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
