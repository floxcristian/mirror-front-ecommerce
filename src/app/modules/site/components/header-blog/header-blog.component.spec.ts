import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBlogComponent } from './header-blog.component';

describe('HeaderBlogComponent', () => {
  let component: HeaderBlogComponent;
  let fixture: ComponentFixture<HeaderBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
