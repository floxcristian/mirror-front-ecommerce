import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDashboardHorizontalBarChartComponent } from './card-dashboard-horizontal-bar-chart.component';

describe('CardDashboardHorizontalBarChartComponent', () => {
  let component: CardDashboardHorizontalBarChartComponent;
  let fixture: ComponentFixture<CardDashboardHorizontalBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDashboardHorizontalBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDashboardHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
