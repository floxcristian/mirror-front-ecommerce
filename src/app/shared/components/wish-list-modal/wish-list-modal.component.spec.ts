import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListModalComponent } from './wish-list-modal.component';

describe('WishListModalComponent', () => {
  let component: WishListModalComponent;
  let fixture: ComponentFixture<WishListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WishListModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
