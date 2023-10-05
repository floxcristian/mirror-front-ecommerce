import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalConfirmDatesComponent } from './modal-confirm-dates.component'

describe('ModalConfirmDatesComponent', () => {
  let component: ModalConfirmDatesComponent
  let fixture: ComponentFixture<ModalConfirmDatesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmDatesComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmDatesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
