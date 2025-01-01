import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aside1Component } from './aside1.component';

describe('Aside1Component', () => {
  let component: Aside1Component;
  let fixture: ComponentFixture<Aside1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Aside1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aside1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
