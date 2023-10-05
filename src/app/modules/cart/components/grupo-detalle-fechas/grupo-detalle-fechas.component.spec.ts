import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { GrupoDetalleFechasComponent } from './grupo-detalle-fechas.component'

describe('GrupoDetalleFechasComponent', () => {
  let component: GrupoDetalleFechasComponent
  let fixture: ComponentFixture<GrupoDetalleFechasComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrupoDetalleFechasComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoDetalleFechasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
