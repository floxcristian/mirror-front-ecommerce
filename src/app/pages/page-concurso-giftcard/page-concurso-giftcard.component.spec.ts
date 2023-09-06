import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConcursoGiftcardComponent } from './page-concurso-giftcard.component';

describe('PageConcursoGiftcardComponent', () => {
  let component: PageConcursoGiftcardComponent;
  let fixture: ComponentFixture<PageConcursoGiftcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageConcursoGiftcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConcursoGiftcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
