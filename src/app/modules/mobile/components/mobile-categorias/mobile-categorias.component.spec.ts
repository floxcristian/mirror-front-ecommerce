import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MobileCategoriasComponent } from './mobile-categorias.component'

describe('MobileCategoriasComponent', () => {
  let component: MobileCategoriasComponent
  let fixture: ComponentFixture<MobileCategoriasComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobileCategoriasComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCategoriasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
