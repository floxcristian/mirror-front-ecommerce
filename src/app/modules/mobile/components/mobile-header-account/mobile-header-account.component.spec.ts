import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MobileHeaderAccountComponent } from './mobile-header-account.component'

describe('MobileHeaderAccountComponent', () => {
  let component: MobileHeaderAccountComponent
  let fixture: ComponentFixture<MobileHeaderAccountComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobileHeaderAccountComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileHeaderAccountComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
