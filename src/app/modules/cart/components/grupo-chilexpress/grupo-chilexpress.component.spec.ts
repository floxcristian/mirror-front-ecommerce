import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoChilexpressComponent } from './grupo-chilexpress.component';

describe('GrupoChilexpressComponent', () => {
  let component: GrupoChilexpressComponent;
  let fixture: ComponentFixture<GrupoChilexpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoChilexpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoChilexpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
