import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { SubjectService } from '../service/subject.service';
import { ISubject } from '../subject.model';
import { SubjectFormService } from './subject-form.service';

import { SubjectUpdateComponent } from './subject-update.component';

describe('Subject Management Update Component', () => {
  let comp: SubjectUpdateComponent;
  let fixture: ComponentFixture<SubjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subjectFormService: SubjectFormService;
  let subjectService: SubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubjectUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SubjectUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubjectUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subjectFormService = TestBed.inject(SubjectFormService);
    subjectService = TestBed.inject(SubjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const subject: ISubject = { id: 11747 };

      activatedRoute.data = of({ subject });
      comp.ngOnInit();

      expect(comp.subject).toEqual(subject);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubject>>();
      const subject = { id: 16494 };
      jest.spyOn(subjectFormService, 'getSubject').mockReturnValue(subject);
      jest.spyOn(subjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subject }));
      saveSubject.complete();

      // THEN
      expect(subjectFormService.getSubject).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(subjectService.update).toHaveBeenCalledWith(expect.objectContaining(subject));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubject>>();
      const subject = { id: 16494 };
      jest.spyOn(subjectFormService, 'getSubject').mockReturnValue({ id: null });
      jest.spyOn(subjectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subject: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subject }));
      saveSubject.complete();

      // THEN
      expect(subjectFormService.getSubject).toHaveBeenCalled();
      expect(subjectService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubject>>();
      const subject = { id: 16494 };
      jest.spyOn(subjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subjectService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
