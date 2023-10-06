/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageComprasComponent } from './page-compras.component';

describe('PageComprasComponent', () => {
  let component: PageComprasComponent;
  let fixture: ComponentFixture<PageComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageComprasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
