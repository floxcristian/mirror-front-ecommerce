import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVinB2bComponent } from './search-vin-b2b.component';

describe('SearchVinB2bComponent', () => {
  let component: SearchVinB2bComponent;
  let fixture: ComponentFixture<SearchVinB2bComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchVinB2bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVinB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
