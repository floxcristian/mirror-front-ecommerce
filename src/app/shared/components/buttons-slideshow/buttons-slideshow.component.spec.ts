import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsSlideshowComponent } from './buttons-slideshow.component';

describe('ButtonsSlideshowComponent', () => {
  let component: ButtonsSlideshowComponent;
  let fixture: ComponentFixture<ButtonsSlideshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsSlideshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
