import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UpdateFlotaModalComponent } from './update-flota-modal.component'

describe('UpdateFlotaModalComponent', () => {
  let component: UpdateFlotaModalComponent
  let fixture: ComponentFixture<UpdateFlotaModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateFlotaModalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFlotaModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
