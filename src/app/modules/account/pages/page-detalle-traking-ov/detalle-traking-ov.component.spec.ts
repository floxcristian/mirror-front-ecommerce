import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DetalleTrakingOvComponent } from './page-detalle-traking-ov.component'

describe('DetalleTrakingOvComponent', () => {
  let component: DetalleTrakingOvComponent
  let fixture: ComponentFixture<DetalleTrakingOvComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleTrakingOvComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTrakingOvComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
