import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductSlideshowSpecialsComponent } from './product-slideshow-specials.component'

describe('ProductSlideshowComponent', () => {
  let component: ProductSlideshowSpecialsComponent
  let fixture: ComponentFixture<ProductSlideshowSpecialsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductSlideshowSpecialsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSlideshowSpecialsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
