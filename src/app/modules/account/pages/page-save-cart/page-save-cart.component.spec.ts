import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSaveCartComponent } from './page-save-cart.component';

describe('PageSaveCartComponent', () => {
  let component: PageSaveCartComponent;
  let fixture: ComponentFixture<PageSaveCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSaveCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSaveCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
