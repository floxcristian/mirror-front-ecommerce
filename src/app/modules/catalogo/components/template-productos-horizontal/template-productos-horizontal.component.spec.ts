import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProductosHorizontalComponent } from './template-productos-horizontal.component';

describe('TemplateProductosHorizontalComponent', () => {
  let component: TemplateProductosHorizontalComponent;
  let fixture: ComponentFixture<TemplateProductosHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateProductosHorizontalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateProductosHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
