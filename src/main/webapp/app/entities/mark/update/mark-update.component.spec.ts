import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISubjectRegister } from 'app/entities/subject-register/subject-register.model';
import { SubjectRegisterService } from 'app/entities/subject-register/service/subject-register.service';
import { MarkService } from '../service/mark.service';
import { IMark } from '../mark.model';
import { MarkFormService } from './mark-form.service';

import { MarkUpdateComponent } from './mark-update.component';

describe('Mark Management Update Component', () => {
  let comp: MarkUpdateComponent;
  let fixture: ComponentFixture<MarkUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let markFormService: MarkFormService;
  let markService: MarkService;
  let subjectRegisterService: SubjectRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarkUpdateComponent],
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
      .overrideTemplate(MarkUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MarkUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    markFormService = TestBed.inject(MarkFormService);
    markService = TestBed.inject(MarkService);
    subjectRegisterService = TestBed.inject(SubjectRegisterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call subjectRegister query and add missing value', () => {
      const mark: IMark = { id: 20546 };
      const subjectRegister: ISubjectRegister = { id: 22971 };
      mark.subjectRegister = subjectRegister;

      const subjectRegisterCollection: ISubjectRegister[] = [{ id: 22971 }];
      jest.spyOn(subjectRegisterService, 'query').mockReturnValue(of(new HttpResponse({ body: subjectRegisterCollection })));
      const expectedCollection: ISubjectRegister[] = [subjectRegister, ...subjectRegisterCollection];
      jest.spyOn(subjectRegisterService, 'addSubjectRegisterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mark });
      comp.ngOnInit();

      expect(subjectRegisterService.query).toHaveBeenCalled();
      expect(subjectRegisterService.addSubjectRegisterToCollectionIfMissing).toHaveBeenCalledWith(
        subjectRegisterCollection,
        subjectRegister,
      );
      expect(comp.subjectRegistersCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mark: IMark = { id: 20546 };
      const subjectRegister: ISubjectRegister = { id: 22971 };
      mark.subjectRegister = subjectRegister;

      activatedRoute.data = of({ mark });
      comp.ngOnInit();

      expect(comp.subjectRegistersCollection).toContainEqual(subjectRegister);
      expect(comp.mark).toEqual(mark);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMark>>();
      const mark = { id: 24153 };
      jest.spyOn(markFormService, 'getMark').mockReturnValue(mark);
      jest.spyOn(markService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mark });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mark }));
      saveSubject.complete();

      // THEN
      expect(markFormService.getMark).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(markService.update).toHaveBeenCalledWith(expect.objectContaining(mark));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMark>>();
      const mark = { id: 24153 };
      jest.spyOn(markFormService, 'getMark').mockReturnValue({ id: null });
      jest.spyOn(markService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mark: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mark }));
      saveSubject.complete();

      // THEN
      expect(markFormService.getMark).toHaveBeenCalled();
      expect(markService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMark>>();
      const mark = { id: 24153 };
      jest.spyOn(markService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mark });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(markService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSubjectRegister', () => {
      it('Should forward to subjectRegisterService', () => {
        const entity = { id: 22971 };
        const entity2 = { id: 25952 };
        jest.spyOn(subjectRegisterService, 'compareSubjectRegister');
        comp.compareSubjectRegister(entity, entity2);
        expect(subjectRegisterService.compareSubjectRegister).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
