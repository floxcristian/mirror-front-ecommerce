import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBasesConcursoComponent } from './page-bases-concurso.component';

describe('PageBasesConcursoComponent', () => {
  let component: PageBasesConcursoComponent;
  let fixture: ComponentFixture<PageBasesConcursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageBasesConcursoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBasesConcursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
