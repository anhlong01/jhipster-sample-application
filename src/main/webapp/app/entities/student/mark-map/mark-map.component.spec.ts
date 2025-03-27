import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkMapComponent } from './mark-map.component';

describe('MarkMapComponent', () => {
  let component: MarkMapComponent;
  let fixture: ComponentFixture<MarkMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
