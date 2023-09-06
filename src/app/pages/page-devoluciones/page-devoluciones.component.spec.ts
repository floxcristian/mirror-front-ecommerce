import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDevolucionesComponent } from './page-devoluciones.component';

describe('PageDevolucionesComponent', () => {
  let component: PageDevolucionesComponent;
  let fixture: ComponentFixture<PageDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDevolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
