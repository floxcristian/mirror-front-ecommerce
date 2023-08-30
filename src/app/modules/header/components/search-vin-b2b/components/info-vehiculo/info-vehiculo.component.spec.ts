import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoVehiculoComponent } from './info-vehiculo.component';

describe('InfoVehiculoComponent', () => {
  let component: InfoVehiculoComponent;
  let fixture: ComponentFixture<InfoVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
