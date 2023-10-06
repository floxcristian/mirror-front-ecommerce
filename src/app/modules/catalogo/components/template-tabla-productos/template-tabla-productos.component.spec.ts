import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTablaProductosComponent } from './template-tabla-productos.component';

describe('TemplateTablaProductosComponent', () => {
  let component: TemplateTablaProductosComponent;
  let fixture: ComponentFixture<TemplateTablaProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateTablaProductosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateTablaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
