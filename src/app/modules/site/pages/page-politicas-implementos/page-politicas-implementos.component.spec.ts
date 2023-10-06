import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePoliticasImplementosComponent } from './page-politicas-implementos.component';

describe('PagePoliticasImplementosComponent', () => {
  let component: PagePoliticasImplementosComponent;
  let fixture: ComponentFixture<PagePoliticasImplementosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PagePoliticasImplementosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePoliticasImplementosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
