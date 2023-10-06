import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTrackingComponent } from './page-tracking.component';

describe('PageTrackingComponent', () => {
  let component: PageTrackingComponent;
  let fixture: ComponentFixture<PageTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageTrackingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
