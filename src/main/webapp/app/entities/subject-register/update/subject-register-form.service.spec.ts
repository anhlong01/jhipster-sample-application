import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../subject-register.test-samples';

import { SubjectRegisterFormService } from './subject-register-form.service';

describe('SubjectRegister Form Service', () => {
  let service: SubjectRegisterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectRegisterFormService);
  });

  describe('Service methods', () => {
    describe('createSubjectRegisterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSubjectRegisterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            student: expect.any(Object),
            subject: expect.any(Object),
          }),
        );
      });

      it('passing ISubjectRegister should create a new form with FormGroup', () => {
        const formGroup = service.createSubjectRegisterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            student: expect.any(Object),
            subject: expect.any(Object),
          }),
        );
      });
    });

    describe('getSubjectRegister', () => {
      it('should return NewSubjectRegister for default SubjectRegister initial value', () => {
        const formGroup = service.createSubjectRegisterFormGroup(sampleWithNewData);

        const subjectRegister = service.getSubjectRegister(formGroup) as any;

        expect(subjectRegister).toMatchObject(sampleWithNewData);
      });

      it('should return NewSubjectRegister for empty SubjectRegister initial value', () => {
        const formGroup = service.createSubjectRegisterFormGroup();

        const subjectRegister = service.getSubjectRegister(formGroup) as any;

        expect(subjectRegister).toMatchObject({});
      });

      it('should return ISubjectRegister', () => {
        const formGroup = service.createSubjectRegisterFormGroup(sampleWithRequiredData);

        const subjectRegister = service.getSubjectRegister(formGroup) as any;

        expect(subjectRegister).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISubjectRegister should not enable id FormControl', () => {
        const formGroup = service.createSubjectRegisterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSubjectRegister should disable id FormControl', () => {
        const formGroup = service.createSubjectRegisterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
