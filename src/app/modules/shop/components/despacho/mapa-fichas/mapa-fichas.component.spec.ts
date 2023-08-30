import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaFichasComponent } from './mapa-fichas.component';

describe('MapaFichasComponent', () => {
  let component: MapaFichasComponent;
  let fixture: ComponentFixture<MapaFichasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaFichasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
