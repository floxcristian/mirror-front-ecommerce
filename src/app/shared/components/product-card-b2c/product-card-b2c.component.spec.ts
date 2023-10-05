import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductCardB2cComponent } from './product-card-b2c.component'

describe('ProductCardB2bComponent', () => {
  let component: ProductCardB2cComponent
  let fixture: ComponentFixture<ProductCardB2cComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardB2cComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardB2cComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
