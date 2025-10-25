import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowErrors } from './show-errors';

describe('ShowErrors', () => {
  let component: ShowErrors;
  let fixture: ComponentFixture<ShowErrors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowErrors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowErrors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
