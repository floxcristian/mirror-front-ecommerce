import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageCartHomeComponent } from './page-cart-home.component'

describe('PageCartHomeComponent', () => {
  let component: PageCartHomeComponent
  let fixture: ComponentFixture<PageCartHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageCartHomeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCartHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
