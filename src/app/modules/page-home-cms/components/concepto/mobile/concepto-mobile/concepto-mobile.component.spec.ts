/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { ConceptoMobileComponent } from './concepto-mobile.component'

describe('ConceptoMobileComponent', () => {
  let component: ConceptoMobileComponent
  let fixture: ComponentFixture<ConceptoMobileComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptoMobileComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoMobileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
