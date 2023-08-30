import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarSelectComponent } from './star-select.component';

describe('StarSelectComponent', () => {
  let component: StarSelectComponent;
  let fixture: ComponentFixture<StarSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
