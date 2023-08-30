import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorductoTrComponent } from './producto-tr.component';

describe('PorductoTrComponent', () => {
  let component: PorductoTrComponent;
  let fixture: ComponentFixture<PorductoTrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorductoTrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorductoTrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
