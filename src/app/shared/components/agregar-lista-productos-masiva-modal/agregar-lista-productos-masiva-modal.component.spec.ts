import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarListaProductosMasivaModalComponent } from './agregar-lista-productos-masiva-modal.component';

describe('AgregarListaProductosMasivaModalComponent', () => {
  let component: AgregarListaProductosMasivaModalComponent;
  let fixture: ComponentFixture<AgregarListaProductosMasivaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarListaProductosMasivaModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      AgregarListaProductosMasivaModalComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
