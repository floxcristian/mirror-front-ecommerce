import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageOmniCartOvSuccessComponent } from './page-omni-cart-ov-success.component';

describe('PageOmniCartOvSuccessComponent', () => {
  let component: PageOmniCartOvSuccessComponent;
  let fixture: ComponentFixture<PageOmniCartOvSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageOmniCartOvSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageOmniCartOvSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
