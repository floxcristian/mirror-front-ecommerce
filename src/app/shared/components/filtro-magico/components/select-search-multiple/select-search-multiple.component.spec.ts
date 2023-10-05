import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SelectSearchMultipleComponent } from './select-search-multiple.component'

describe('SelectSearchMultipleComponent', () => {
  let component: SelectSearchMultipleComponent
  let fixture: ComponentFixture<SelectSearchMultipleComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectSearchMultipleComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSearchMultipleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
