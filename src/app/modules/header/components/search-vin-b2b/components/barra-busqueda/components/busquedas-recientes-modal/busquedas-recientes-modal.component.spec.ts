import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedasRecientesModalComponent } from './busquedas-recientes-modal.component';

describe('BusquedasRecientesModalComponent', () => {
  let component: BusquedasRecientesModalComponent;
  let fixture: ComponentFixture<BusquedasRecientesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedasRecientesModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedasRecientesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
