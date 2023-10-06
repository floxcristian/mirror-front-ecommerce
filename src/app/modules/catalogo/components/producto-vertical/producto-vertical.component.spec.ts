import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoVerticalComponent } from './producto-vertical.component';

describe('ProductoVerticalComponent', () => {
  let component: ProductoVerticalComponent;
  let fixture: ComponentFixture<ProductoVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoVerticalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
