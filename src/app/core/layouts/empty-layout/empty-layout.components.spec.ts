import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyLayoutComponents } from './empty-layout.components';

describe('EmptyLayoutComponents', () => {
  let component: EmptyLayoutComponents;
  let fixture: ComponentFixture<EmptyLayoutComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyLayoutComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyLayoutComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
