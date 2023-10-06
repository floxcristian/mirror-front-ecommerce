import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoSelectBusquedaComponent } from './producto-select-busqueda.component';

describe('ProductoSelectBusquedaComponent', () => {
  let component: ProductoSelectBusquedaComponent;
  let fixture: ComponentFixture<ProductoSelectBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductoSelectBusquedaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoSelectBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
