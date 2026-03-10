import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutWithFooterComponents } from './layout-with-footer.components';

describe('LayoutWithFooterComponents', () => {
  let component: LayoutWithFooterComponents;
  let fixture: ComponentFixture<LayoutWithFooterComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutWithFooterComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutWithFooterComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
