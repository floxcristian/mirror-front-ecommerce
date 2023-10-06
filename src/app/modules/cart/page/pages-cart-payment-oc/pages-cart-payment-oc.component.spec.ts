import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesCartPaymentOcComponent } from './pages-cart-payment-oc.component';

describe('PagesCartPaymentOcComponent', () => {
  let component: PagesCartPaymentOcComponent;
  let fixture: ComponentFixture<PagesCartPaymentOcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PagesCartPaymentOcComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesCartPaymentOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
