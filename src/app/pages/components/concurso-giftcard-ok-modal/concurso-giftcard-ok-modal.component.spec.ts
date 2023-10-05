import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ConcursoGiftcardOkModalComponent } from './concurso-giftcard-ok-modal.component'

describe('ConcursoGiftcardOkModalComponent', () => {
  let component: ConcursoGiftcardOkModalComponent
  let fixture: ComponentFixture<ConcursoGiftcardOkModalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcursoGiftcardOkModalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcursoGiftcardOkModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
