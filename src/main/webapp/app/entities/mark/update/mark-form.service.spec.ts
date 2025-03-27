import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../mark.test-samples';

import { MarkFormService } from './mark-form.service';

describe('Mark Form Service', () => {
  let service: MarkFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkFormService);
  });

  describe('Service methods', () => {
    describe('createMarkFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMarkFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            score: expect.any(Object),
            subjectRegister: expect.any(Object),
          }),
        );
      });

      it('passing IMark should create a new form with FormGroup', () => {
        const formGroup = service.createMarkFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            score: expect.any(Object),
            subjectRegister: expect.any(Object),
          }),
        );
      });
    });

    describe('getMark', () => {
      it('should return NewMark for default Mark initial value', () => {
        const formGroup = service.createMarkFormGroup(sampleWithNewData);

        const mark = service.getMark(formGroup) as any;

        expect(mark).toMatchObject(sampleWithNewData);
      });

      it('should return NewMark for empty Mark initial value', () => {
        const formGroup = service.createMarkFormGroup();

        const mark = service.getMark(formGroup) as any;

        expect(mark).toMatchObject({});
      });

      it('should return IMark', () => {
        const formGroup = service.createMarkFormGroup(sampleWithRequiredData);

        const mark = service.getMark(formGroup) as any;

        expect(mark).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMark should not enable id FormControl', () => {
        const formGroup = service.createMarkFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMark should disable id FormControl', () => {
        const formGroup = service.createMarkFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
