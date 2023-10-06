import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTrackingOvComponent } from './page-tracking-ov.component';

describe('PageTrackingOvComponent', () => {
  let component: PageTrackingOvComponent;
  let fixture: ComponentFixture<PageTrackingOvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageTrackingOvComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTrackingOvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
