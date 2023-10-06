import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactModalComponent } from './update-contact-modal.component';

describe('UpdateContactModalComponent', () => {
  let component: UpdateContactModalComponent;
  let fixture: ComponentFixture<UpdateContactModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateContactModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
