import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DetalleCarroProductosOcComponent } from './detalle-carro-productos-oc.component'

describe('DetalleCarroProductosOcComponent', () => {
  let component: DetalleCarroProductosOcComponent
  let fixture: ComponentFixture<DetalleCarroProductosOcComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleCarroProductosOcComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCarroProductosOcComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
