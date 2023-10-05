import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BlockBrandsB2cComponent } from './block-brands-b2c.component'

describe('BlockBrandsB2cComponent', () => {
  let component: BlockBrandsB2cComponent
  let fixture: ComponentFixture<BlockBrandsB2cComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockBrandsB2cComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockBrandsB2cComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
