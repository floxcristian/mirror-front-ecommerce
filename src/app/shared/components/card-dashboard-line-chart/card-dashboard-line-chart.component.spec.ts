import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDashboardLineChartComponent } from './card-dashboard-line-chart.component';

describe('CardDashboardLineChartComponent', () => {
  let component: CardDashboardLineChartComponent;
  let fixture: ComponentFixture<CardDashboardLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDashboardLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDashboardLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
