/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Lista_productoComponent } from './lista_producto.component';

describe('Lista_productoComponent', () => {
  let component: Lista_productoComponent;
  let fixture: ComponentFixture<Lista_productoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Lista_productoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Lista_productoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
