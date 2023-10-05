import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductListModalComponent } from './product-list-modal.component'

describe('ProductListModalComponent', () => {
  let component: ProductListModalComponent
  let fixture: ComponentFixture<ProductListModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListModalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
