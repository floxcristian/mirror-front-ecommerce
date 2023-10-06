/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Modal_reciboComponent } from './modal_recibo.component';

describe('Modal_reciboComponent', () => {
  let component: Modal_reciboComponent;
  let fixture: ComponentFixture<Modal_reciboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Modal_reciboComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Modal_reciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
