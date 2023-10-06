import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategoriasB2cComponent } from './menu-categorias-b2c.component';

describe('MenuCategoriasB2cComponent', () => {
  let component: MenuCategoriasB2cComponent;
  let fixture: ComponentFixture<MenuCategoriasB2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuCategoriasB2cComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCategoriasB2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
