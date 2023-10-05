import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AngularEmailAutocompleteComponent } from './angular-email-autocomplete.component'

describe('AngularEmailAutocompleteComponent', () => {
  let component: AngularEmailAutocompleteComponent
  let fixture: ComponentFixture<AngularEmailAutocompleteComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AngularEmailAutocompleteComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularEmailAutocompleteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
