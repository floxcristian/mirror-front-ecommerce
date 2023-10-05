import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageListaPreciosComponent } from './page-lista-precios.component'

describe('PageListaPreciosComponent', () => {
  let component: PageListaPreciosComponent
  let fixture: ComponentFixture<PageListaPreciosComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageListaPreciosComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageListaPreciosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
