import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroMagicoComponent } from './filtro-magico.component';

describe('FiltroMagicoComponent', () => {
  let component: FiltroMagicoComponent;
  let fixture: ComponentFixture<FiltroMagicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltroMagicoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroMagicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
