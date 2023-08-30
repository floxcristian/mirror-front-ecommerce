import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBarraBusquedaComponent } from './mobile-barra-busqueda.component';

describe('MobileBarraBusquedaComponent', () => {
  let component: MobileBarraBusquedaComponent;
  let fixture: ComponentFixture<MobileBarraBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileBarraBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileBarraBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
