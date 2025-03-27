import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { SubjectRegisterDetailComponent } from './subject-register-detail.component';

describe('SubjectRegister Management Detail Component', () => {
  let comp: SubjectRegisterDetailComponent;
  let fixture: ComponentFixture<SubjectRegisterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectRegisterDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./subject-register-detail.component').then(m => m.SubjectRegisterDetailComponent),
              resolve: { subjectRegister: () => of({ id: 22971 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SubjectRegisterDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRegisterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load subjectRegister on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SubjectRegisterDetailComponent);

      // THEN
      expect(instance.subjectRegister()).toEqual(expect.objectContaining({ id: 22971 }));
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
