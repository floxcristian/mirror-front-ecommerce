import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRegistroUsuarioComponent } from './page-registro-usuario.component';

describe('PageRegistroUsuarioComponent', () => {
  let component: PageRegistroUsuarioComponent;
  let fixture: ComponentFixture<PageRegistroUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRegistroUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRegistroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
