import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { MarkDetailComponent } from './mark-detail.component';

describe('Mark Management Detail Component', () => {
  let comp: MarkDetailComponent;
  let fixture: ComponentFixture<MarkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./mark-detail.component').then(m => m.MarkDetailComponent),
              resolve: { mark: () => of({ id: 24153 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MarkDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mark on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MarkDetailComponent);

      // THEN
      expect(instance.mark()).toEqual(expect.objectContaining({ id: 24153 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
