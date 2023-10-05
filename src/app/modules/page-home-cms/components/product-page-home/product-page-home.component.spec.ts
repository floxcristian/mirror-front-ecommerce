/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { ProductPageHomeComponent } from './product-page-home.component'

describe('ProductPageHomeComponent', () => {
  let component: ProductPageHomeComponent
  let fixture: ComponentFixture<ProductPageHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPageHomeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
