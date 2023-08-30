/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuCategoriaB2cMobileComponent } from './menu-categoria-b2c-mobile.component';

describe('MenuCategoriaB2cMobileComponent', () => {
  let component: MenuCategoriaB2cMobileComponent;
  let fixture: ComponentFixture<MenuCategoriaB2cMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCategoriaB2cMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCategoriaB2cMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
