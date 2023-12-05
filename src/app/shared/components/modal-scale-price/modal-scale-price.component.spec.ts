import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScalePriceComponent } from './modal-scale-price.component';

describe('ModalScalePriceComponent', () => {
  let component: ModalScalePriceComponent;
  let fixture: ComponentFixture<ModalScalePriceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalScalePriceComponent],
    });
    fixture = TestBed.createComponent(ModalScalePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
