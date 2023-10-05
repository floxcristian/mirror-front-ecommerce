import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FooterCatalogoComponent } from './footer-catalogo.component'

describe('FooterCatalogoComponent', () => {
  let component: FooterCatalogoComponent
  let fixture: ComponentFixture<FooterCatalogoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FooterCatalogoComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCatalogoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
