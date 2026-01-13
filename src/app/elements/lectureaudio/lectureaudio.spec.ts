import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lectureaudio } from './lectureaudio';

describe('Lectureaudio', () => {
  let component: Lectureaudio;
  let fixture: ComponentFixture<Lectureaudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lectureaudio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lectureaudio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
