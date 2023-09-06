import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedStepsComponent } from './guided-steps.component';

describe('GuidedStepsComponent', () => {
  let component: GuidedStepsComponent;
  let fixture: ComponentFixture<GuidedStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidedStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
