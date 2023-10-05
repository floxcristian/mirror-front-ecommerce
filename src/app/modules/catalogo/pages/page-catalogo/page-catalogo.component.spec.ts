import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PageCatalogoComponent } from './page-catalogo.component'

describe('PageCatalogoComponent', () => {
  let component: PageCatalogoComponent
  let fixture: ComponentFixture<PageCatalogoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageCatalogoComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCatalogoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
