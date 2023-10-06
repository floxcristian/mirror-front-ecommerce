import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoStockComponent } from './aviso-stock.component';

describe('AvisoStockComponent', () => {
  let component: AvisoStockComponent;
  let fixture: ComponentFixture<AvisoStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvisoStockComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
