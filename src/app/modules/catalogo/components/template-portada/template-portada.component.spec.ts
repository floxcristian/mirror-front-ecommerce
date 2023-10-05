import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TemplatePortadaComponent } from './template-portada.component'

describe('TemplatePortadaComponent', () => {
  let component: TemplatePortadaComponent
  let fixture: ComponentFixture<TemplatePortadaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatePortadaComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePortadaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
