import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageGestionUsuarioComponent } from './page-gestion-usuario.component';

describe('PageGestionUsuarioComponent', () => {
  let component: PageGestionUsuarioComponent;
  let fixture: ComponentFixture<PageGestionUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageGestionUsuarioComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGestionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
