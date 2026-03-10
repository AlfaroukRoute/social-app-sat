import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutWithSidebarComponents } from './layout-with-sidebar.components';

describe('LayoutWithSidebarComponents', () => {
  let component: LayoutWithSidebarComponents;
  let fixture: ComponentFixture<LayoutWithSidebarComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutWithSidebarComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutWithSidebarComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
