import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDetalleFechaMobileComponent } from './grupo-detalle-fecha-mobile.component';

describe('GrupoDetalleFechaMobileComponent', () => {
  let component: GrupoDetalleFechaMobileComponent;
  let fixture: ComponentFixture<GrupoDetalleFechaMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrupoDetalleFechaMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoDetalleFechaMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
