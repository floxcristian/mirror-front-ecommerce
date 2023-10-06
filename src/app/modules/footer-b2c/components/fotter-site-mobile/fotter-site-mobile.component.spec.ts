/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FotterSiteMobileComponent } from './fotter-site-mobile.component';

describe('FotterSiteMobileComponent', () => {
  let component: FotterSiteMobileComponent;
  let fixture: ComponentFixture<FotterSiteMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FotterSiteMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FotterSiteMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
