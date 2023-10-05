import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageCartChilexpressComponent } from './page-cart-chilexpress.component'

describe('PageCartChilexpressComponent', () => {
  let component: PageCartChilexpressComponent
  let fixture: ComponentFixture<PageCartChilexpressComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageCartChilexpressComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCartChilexpressComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
