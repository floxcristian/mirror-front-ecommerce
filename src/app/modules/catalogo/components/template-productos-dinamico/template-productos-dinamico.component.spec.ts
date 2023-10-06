import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProductosDinamicoComponent } from './template-productos-dinamico.component';

describe('TemplateProductosDinamicoComponent', () => {
  let component: TemplateProductosDinamicoComponent;
  let fixture: ComponentFixture<TemplateProductosDinamicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateProductosDinamicoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateProductosDinamicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
