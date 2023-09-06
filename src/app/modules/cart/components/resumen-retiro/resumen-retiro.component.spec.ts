import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenRetiroComponent } from './resumen-retiro.component';

describe('ResumenRetiroComponent', () => {
  let component: ResumenRetiroComponent;
  let fixture: ComponentFixture<ResumenRetiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenRetiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenRetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
