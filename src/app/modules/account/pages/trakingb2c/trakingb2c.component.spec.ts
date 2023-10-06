import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Trakingb2cComponent } from './trakingb2c.component';

describe('Trakingb2cComponent', () => {
  let component: Trakingb2cComponent;
  let fixture: ComponentFixture<Trakingb2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Trakingb2cComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Trakingb2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
