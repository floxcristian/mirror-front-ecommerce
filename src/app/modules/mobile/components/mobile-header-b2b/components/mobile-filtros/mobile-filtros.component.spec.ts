import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFiltrosComponent } from './mobile-filtros.component';

describe('MobileFiltrosComponent', () => {
  let component: MobileFiltrosComponent;
  let fixture: ComponentFixture<MobileFiltrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileFiltrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
