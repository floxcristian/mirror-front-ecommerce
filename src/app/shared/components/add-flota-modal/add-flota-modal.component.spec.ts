import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlotaModalComponent } from './add-flota-modal.component';

describe('AddFlotaModalComponent', () => {
  let component: AddFlotaModalComponent;
  let fixture: ComponentFixture<AddFlotaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFlotaModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlotaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
