import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageInicioSesionComponent } from './page-inicio-sesion.component'

describe('PageInicioSesionComponent', () => {
  let component: PageInicioSesionComponent
  let fixture: ComponentFixture<PageInicioSesionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageInicioSesionComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInicioSesionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
