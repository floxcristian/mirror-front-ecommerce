import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCatalogoComponent } from './header-catalogo.component';

describe('HeaderCatalogoComponent', () => {
  let component: HeaderCatalogoComponent;
  let fixture: ComponentFixture<HeaderCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderCatalogoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
