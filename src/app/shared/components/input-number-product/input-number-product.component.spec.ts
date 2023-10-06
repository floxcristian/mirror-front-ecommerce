import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumberProductComponent } from './input-number-product.component';

describe('InputNumberProductComponent', () => {
  let component: InputNumberProductComponent;
  let fixture: ComponentFixture<InputNumberProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputNumberProductComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumberProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
