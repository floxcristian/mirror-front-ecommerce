import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapChilexpressComponent } from './map-chilexpress.component';

describe('MapChilexpressComponent', () => {
  let component: MapChilexpressComponent;
  let fixture: ComponentFixture<MapChilexpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapChilexpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapChilexpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
