import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutWithNavbarComponents } from './layout-with-navbar.components';

describe('LayoutWithNavbarComponents', () => {
  let component: LayoutWithNavbarComponents;
  let fixture: ComponentFixture<LayoutWithNavbarComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutWithNavbarComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutWithNavbarComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
