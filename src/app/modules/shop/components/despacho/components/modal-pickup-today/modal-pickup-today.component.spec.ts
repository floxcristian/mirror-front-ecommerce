import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPickupTodayComponent } from './modal-pickup-today.component';

describe('ModalPickupTodayComponent', () => {
  let component: ModalPickupTodayComponent;
  let fixture: ComponentFixture<ModalPickupTodayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPickupTodayComponent],
    });
    fixture = TestBed.createComponent(ModalPickupTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
