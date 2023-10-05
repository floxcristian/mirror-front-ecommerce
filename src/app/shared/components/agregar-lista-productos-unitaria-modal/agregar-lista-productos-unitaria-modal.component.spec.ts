import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AgregarListaProductosUnitariaModalComponent } from './agregar-lista-productos-unitaria-modal.component'

describe('AgregarListaProductosUnitariaModalComponent', () => {
  let component: AgregarListaProductosUnitariaModalComponent
  let fixture: ComponentFixture<AgregarListaProductosUnitariaModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarListaProductosUnitariaModalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(
      AgregarListaProductosUnitariaModalComponent,
    )
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
