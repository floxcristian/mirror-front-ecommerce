import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnFavoritesComponent } from './btn-favorites.component';

describe('BtnFavoritesComponent', () => {
  let component: BtnFavoritesComponent;
  let fixture: ComponentFixture<BtnFavoritesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
