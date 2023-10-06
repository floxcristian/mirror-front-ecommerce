import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStoresComponent } from './modal-stores.component';

describe('ModalStoresComponent', () => {
  let component: ModalStoresComponent;
  let fixture: ComponentFixture<ModalStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalStoresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
