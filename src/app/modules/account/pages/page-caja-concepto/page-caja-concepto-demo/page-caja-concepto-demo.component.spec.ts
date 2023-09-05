import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCajaConceptoDemoComponent } from './page-caja-concepto-demo.component';

describe('PageCajaConceptoDemoComponent', () => {
  let component: PageCajaConceptoDemoComponent;
  let fixture: ComponentFixture<PageCajaConceptoDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCajaConceptoDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCajaConceptoDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
