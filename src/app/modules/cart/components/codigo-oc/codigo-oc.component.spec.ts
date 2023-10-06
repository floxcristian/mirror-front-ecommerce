import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoOcComponent } from './codigo-oc.component';

describe('CodigoOcComponent', () => {
  let component: CodigoOcComponent;
  let fixture: ComponentFixture<CodigoOcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodigoOcComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
