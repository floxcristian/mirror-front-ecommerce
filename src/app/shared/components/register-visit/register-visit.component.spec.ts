import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVisitComponent } from './register-visit.component';

describe('RegisterVisitComponent', () => {
  let component: RegisterVisitComponent;
  let fixture: ComponentFixture<RegisterVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterVisitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
