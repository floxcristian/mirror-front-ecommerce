import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCyberComponent } from './page-cyber.component';

describe('PageCyberComponent', () => {
  let component: PageCyberComponent;
  let fixture: ComponentFixture<PageCyberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCyberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCyberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
