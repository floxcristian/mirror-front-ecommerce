import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateUnProductoComponent } from './template-un-producto.component';

describe('TemplateUnProductoComponent', () => {
  let component: TemplateUnProductoComponent;
  let fixture: ComponentFixture<TemplateUnProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateUnProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateUnProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
