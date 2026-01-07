import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zoneduree } from './zoneduree';

describe('Zoneduree', () => {
  let component: Zoneduree;
  let fixture: ComponentFixture<Zoneduree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zoneduree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zoneduree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
