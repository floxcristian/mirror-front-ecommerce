import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDashboardNoChartComponent } from './card-dashboard-no-chart.component';

describe('CardDashboardNoChartComponent', () => {
  let component: CardDashboardNoChartComponent;
  let fixture: ComponentFixture<CardDashboardNoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardDashboardNoChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDashboardNoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
