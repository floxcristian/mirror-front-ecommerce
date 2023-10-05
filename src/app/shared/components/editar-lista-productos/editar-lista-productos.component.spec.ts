import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { EditarListaProductosComponent } from './editar-lista-productos.component'

describe('EditarListaProductosComponent', () => {
  let component: EditarListaProductosComponent
  let fixture: ComponentFixture<EditarListaProductosComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditarListaProductosComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarListaProductosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
