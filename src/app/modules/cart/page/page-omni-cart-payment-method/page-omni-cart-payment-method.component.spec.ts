import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageOmniCartPaymentMethodComponent } from './page-omni-cart-payment-method.component';

describe('PageOmniCartPaymentMethodComponent', () => {
  let component: PageOmniCartPaymentMethodComponent;
  let fixture: ComponentFixture<PageOmniCartPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageOmniCartPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageOmniCartPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
