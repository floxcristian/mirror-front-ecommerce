import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FechasPromesasComponent } from './fechas-promesas.component';

describe('FechasPromesasComponent', () => {
  let component: FechasPromesasComponent;
  let fixture: ComponentFixture<FechasPromesasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FechasPromesasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FechasPromesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
