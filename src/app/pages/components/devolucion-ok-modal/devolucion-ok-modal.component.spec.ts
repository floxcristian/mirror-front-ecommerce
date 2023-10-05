import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DevolucionOkModalComponent } from './devolucion-ok-modal.component'

describe('DevolucionOkModalComponent', () => {
  let component: DevolucionOkModalComponent
  let fixture: ComponentFixture<DevolucionOkModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DevolucionOkModalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionOkModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
