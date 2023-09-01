/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VerMasProductoComponent } from './ver-mas-producto.component';

describe('VerMasProductoComponent', () => {
  let component: VerMasProductoComponent;
  let fixture: ComponentFixture<VerMasProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerMasProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMasProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
