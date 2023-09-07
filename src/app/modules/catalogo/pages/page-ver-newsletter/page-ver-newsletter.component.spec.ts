import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVerNewsletterComponent } from './page-ver-newsletter.component';

describe('PageVerNewsletterComponent', () => {
  let component: PageVerNewsletterComponent;
  let fixture: ComponentFixture<PageVerNewsletterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageVerNewsletterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVerNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
