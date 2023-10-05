import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageCartRequestSuccessComponent } from './page-cart-request-success.component'

describe('PageCartRequestSuccessComponent', () => {
  let component: PageCartRequestSuccessComponent
  let fixture: ComponentFixture<PageCartRequestSuccessComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageCartRequestSuccessComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCartRequestSuccessComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
