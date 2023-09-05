import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCajaConceptoComponent } from './page-caja-concepto.component';

describe('PageCajaConceptoComponent', () => {
  let component: PageCajaConceptoComponent;
  let fixture: ComponentFixture<PageCajaConceptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCajaConceptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCajaConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
