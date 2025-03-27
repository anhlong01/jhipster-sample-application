import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ISubject } from 'app/entities/subject/subject.model';
import { SubjectService } from 'app/entities/subject/service/subject.service';
import { ISubjectRegister } from '../subject-register.model';
import { SubjectRegisterService } from '../service/subject-register.service';
import { SubjectRegisterFormService } from './subject-register-form.service';

import { SubjectRegisterUpdateComponent } from './subject-register-update.component';

describe('SubjectRegister Management Update Component', () => {
  let comp: SubjectRegisterUpdateComponent;
  let fixture: ComponentFixture<SubjectRegisterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subjectRegisterFormService: SubjectRegisterFormService;
  let subjectRegisterService: SubjectRegisterService;
  let studentService: StudentService;
  let subjectService: SubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubjectRegisterUpdateComponent],
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
      .overrideTemplate(SubjectRegisterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubjectRegisterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subjectRegisterFormService = TestBed.inject(SubjectRegisterFormService);
    subjectRegisterService = TestBed.inject(SubjectRegisterService);
    studentService = TestBed.inject(StudentService);
    subjectService = TestBed.inject(SubjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const subjectRegister: ISubjectRegister = { id: 25952 };
      const student: IStudent = { id: 9978 };
      subjectRegister.student = student;

      const studentCollection: IStudent[] = [{ id: 9978 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ subjectRegister });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Subject query and add missing value', () => {
      const subjectRegister: ISubjectRegister = { id: 25952 };
      const subject: ISubject = { id: 16494 };
      subjectRegister.subject = subject;

      const subjectCollection: ISubject[] = [{ id: 16494 }];
      jest.spyOn(subjectService, 'query').mockReturnValue(of(new HttpResponse({ body: subjectCollection })));
      const additionalSubjects = [subject];
      const expectedCollection: ISubject[] = [...additionalSubjects, ...subjectCollection];
      jest.spyOn(subjectService, 'addSubjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ subjectRegister });
      comp.ngOnInit();

      expect(subjectService.query).toHaveBeenCalled();
      expect(subjectService.addSubjectToCollectionIfMissing).toHaveBeenCalledWith(
        subjectCollection,
        ...additionalSubjects.map(expect.objectContaining),
      );
      expect(comp.subjectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const subjectRegister: ISubjectRegister = { id: 25952 };
      const student: IStudent = { id: 9978 };
      subjectRegister.student = student;
      const subject: ISubject = { id: 16494 };
      subjectRegister.subject = subject;

      activatedRoute.data = of({ subjectRegister });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContainEqual(student);
      expect(comp.subjectsSharedCollection).toContainEqual(subject);
      expect(comp.subjectRegister).toEqual(subjectRegister);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjectRegister>>();
      const subjectRegister = { id: 22971 };
      jest.spyOn(subjectRegisterFormService, 'getSubjectRegister').mockReturnValue(subjectRegister);
      jest.spyOn(subjectRegisterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjectRegister });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subjectRegister }));
      saveSubject.complete();

      // THEN
      expect(subjectRegisterFormService.getSubjectRegister).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(subjectRegisterService.update).toHaveBeenCalledWith(expect.objectContaining(subjectRegister));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjectRegister>>();
      const subjectRegister = { id: 22971 };
      jest.spyOn(subjectRegisterFormService, 'getSubjectRegister').mockReturnValue({ id: null });
      jest.spyOn(subjectRegisterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjectRegister: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subjectRegister }));
      saveSubject.complete();

      // THEN
      expect(subjectRegisterFormService.getSubjectRegister).toHaveBeenCalled();
      expect(subjectRegisterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubjectRegister>>();
      const subjectRegister = { id: 22971 };
      jest.spyOn(subjectRegisterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subjectRegister });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subjectRegisterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStudent', () => {
      it('Should forward to studentService', () => {
        const entity = { id: 9978 };
        const entity2 = { id: 22718 };
        jest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSubject', () => {
      it('Should forward to subjectService', () => {
        const entity = { id: 16494 };
        const entity2 = { id: 11747 };
        jest.spyOn(subjectService, 'compareSubject');
        comp.compareSubject(entity, entity2);
        expect(subjectService.compareSubject).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
