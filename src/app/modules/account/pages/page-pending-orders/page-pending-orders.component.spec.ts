import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePendingOrdersComponent } from './page-pending-orders.component';

describe('PagePendingOrdersComponent', () => {
  let component: PagePendingOrdersComponent;
  let fixture: ComponentFixture<PagePendingOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PagePendingOrdersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePendingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
