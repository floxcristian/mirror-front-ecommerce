import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProductosVerticalComponent } from './template-productos-vertical.component';

describe('TemplateProductosVerticalComponent', () => {
  let component: TemplateProductosVerticalComponent;
  let fixture: ComponentFixture<TemplateProductosVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateProductosVerticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateProductosVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
