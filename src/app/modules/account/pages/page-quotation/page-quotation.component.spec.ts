import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageQuotationComponent } from './page-quotation.component';

describe('PageQuotationComponent', () => {
  let component: PageQuotationComponent;
  let fixture: ComponentFixture<PageQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageQuotationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
