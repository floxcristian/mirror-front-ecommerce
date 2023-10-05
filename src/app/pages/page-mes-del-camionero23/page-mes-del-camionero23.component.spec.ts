import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageMesDelCamionero23Component } from './page-mes-del-camionero23.component'

describe('PageMesDelCamionero23Component', () => {
  let component: PageMesDelCamionero23Component
  let fixture: ComponentFixture<PageMesDelCamionero23Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageMesDelCamionero23Component],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMesDelCamionero23Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
