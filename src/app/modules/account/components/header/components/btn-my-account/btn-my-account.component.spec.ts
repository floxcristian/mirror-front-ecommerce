import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnMyAccountComponent } from './btn-my-account.component';

describe('BtnMyAccountComponent', () => {
  let component: BtnMyAccountComponent;
  let fixture: ComponentFixture<BtnMyAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnMyAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnMyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
