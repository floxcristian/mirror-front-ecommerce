import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnOrderApprovalComponent } from './btn-order-approval.component';

describe('BtnOrderApprovalComponent', () => {
  let component: BtnOrderApprovalComponent;
  let fixture: ComponentFixture<BtnOrderApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnOrderApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnOrderApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
