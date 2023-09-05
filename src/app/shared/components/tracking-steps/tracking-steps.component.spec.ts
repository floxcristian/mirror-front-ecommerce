import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingStepsComponent } from './tracking-steps.component';

describe('TrackingStepsComponent', () => {
  let component: TrackingStepsComponent;
  let fixture: ComponentFixture<TrackingStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
