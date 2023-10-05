import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DetalleTecnicosComponent } from './detalle-tecnicos.component'

describe('DetalleTecnicosComponent', () => {
  let component: DetalleTecnicosComponent
  let fixture: ComponentFixture<DetalleTecnicosComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleTecnicosComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTecnicosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
