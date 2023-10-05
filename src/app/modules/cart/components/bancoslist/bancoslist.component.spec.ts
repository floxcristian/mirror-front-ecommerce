import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BancoslistComponent } from './bancoslist.component'

describe('BancoslistComponent', () => {
  let component: BancoslistComponent
  let fixture: ComponentFixture<BancoslistComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BancoslistComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoslistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
