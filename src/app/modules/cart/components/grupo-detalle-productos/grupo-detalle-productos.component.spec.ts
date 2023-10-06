import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDetalleProductosComponent } from './grupo-detalle-productos.component';

describe('GrupoDetalleProductosComponent', () => {
  let component: GrupoDetalleProductosComponent;
  let fixture: ComponentFixture<GrupoDetalleProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrupoDetalleProductosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoDetalleProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
