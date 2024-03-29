import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactanosComponent } from './contactanos.component';

describe('ContactenosComponent', () => {
  let component: ContactanosComponent;
  let fixture: ComponentFixture<ContactanosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactanosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
