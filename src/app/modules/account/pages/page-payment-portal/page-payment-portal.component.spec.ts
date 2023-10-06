import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePaymentPortalComponent } from './page-payment-portal.component';

describe('PagePaymentPortalComponent', () => {
  let component: PagePaymentPortalComponent;
  let fixture: ComponentFixture<PagePaymentPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PagePaymentPortalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePaymentPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
