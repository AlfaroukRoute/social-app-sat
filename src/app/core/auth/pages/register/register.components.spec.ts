import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponents } from './register.components';

describe('RegisterComponents', () => {
  let component: RegisterComponents;
  let fixture: ComponentFixture<RegisterComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
