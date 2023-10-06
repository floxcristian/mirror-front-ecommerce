import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDownloadpdfComponent } from './page-downloadpdf.component';

describe('PageDownloadpdfComponent', () => {
  let component: PageDownloadpdfComponent;
  let fixture: ComponentFixture<PageDownloadpdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageDownloadpdfComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDownloadpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
