import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListasDeProductosComponent } from './page-listas-de-productos.component';

describe('PageListasDeProductosComponent', () => {
  let component: PageListasDeProductosComponent;
  let fixture: ComponentFixture<PageListasDeProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageListasDeProductosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageListasDeProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
