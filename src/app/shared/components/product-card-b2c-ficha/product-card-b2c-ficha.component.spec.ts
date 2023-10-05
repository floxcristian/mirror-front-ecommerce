import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductCardB2cFichaComponent } from './product-card-b2c-ficha.component'

describe('ProductCardB2cFichaComponent', () => {
  let component: ProductCardB2cFichaComponent
  let fixture: ComponentFixture<ProductCardB2cFichaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardB2cFichaComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardB2cFichaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
