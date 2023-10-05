import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { VerificarpagoComponent } from './verificarpago.component'

describe('VerificarpagoComponent', () => {
  let component: VerificarpagoComponent
  let fixture: ComponentFixture<VerificarpagoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerificarpagoComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarpagoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
