import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DireccionDespachoComponent } from './direccion-despacho.component'

describe('DireccionDespachoComponent', () => {
  let component: DireccionDespachoComponent
  let fixture: ComponentFixture<DireccionDespachoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DireccionDespachoComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DireccionDespachoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
