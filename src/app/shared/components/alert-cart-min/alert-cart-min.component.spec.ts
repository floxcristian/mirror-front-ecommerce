import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCartMinComponent } from './alert-cart-min.component';

describe('AlertCartMinComponent', () => {
  let component: AlertCartMinComponent;
  let fixture: ComponentFixture<AlertCartMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertCartMinComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCartMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
