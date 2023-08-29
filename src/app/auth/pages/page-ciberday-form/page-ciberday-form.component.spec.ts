import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCiberdayFormComponent } from './page-ciberday-form.component';

describe('PageCiberdayFormComponent', () => {
  let component: PageCiberdayFormComponent;
  let fixture: ComponentFixture<PageCiberdayFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCiberdayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCiberdayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
