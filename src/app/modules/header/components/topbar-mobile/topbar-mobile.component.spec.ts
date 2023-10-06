import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarMobileComponent } from './topbar-mobile.component';

describe('TopbarMobileComponent', () => {
  let component: TopbarMobileComponent;
  let fixture: ComponentFixture<TopbarMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopbarMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
