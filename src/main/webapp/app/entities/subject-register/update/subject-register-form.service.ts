import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ISubjectRegister, NewSubjectRegister } from '../subject-register.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISubjectRegister for edit and NewSubjectRegisterFormGroupInput for create.
 */
type SubjectRegisterFormGroupInput = ISubjectRegister | PartialWithRequiredKeyOf<NewSubjectRegister>;

type SubjectRegisterFormDefaults = Pick<NewSubjectRegister, 'id'>;

type SubjectRegisterFormGroupContent = {
  id: FormControl<ISubjectRegister['id'] | NewSubjectRegister['id']>;
  student: FormControl<ISubjectRegister['student']>;
  subject: FormControl<ISubjectRegister['subject']>;
};

export type SubjectRegisterFormGroup = FormGroup<SubjectRegisterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SubjectRegisterFormService {
  createSubjectRegisterFormGroup(subjectRegister: SubjectRegisterFormGroupInput = { id: null }): SubjectRegisterFormGroup {
    const subjectRegisterRawValue = {
      ...this.getFormDefaults(),
      ...subjectRegister,
    };
    return new FormGroup<SubjectRegisterFormGroupContent>({
      id: new FormControl(
        { value: subjectRegisterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      student: new FormControl(subjectRegisterRawValue.student),
      subject: new FormControl(subjectRegisterRawValue.subject),
    });
  }

  getSubjectRegister(form: SubjectRegisterFormGroup): ISubjectRegister | NewSubjectRegister {
    return form.getRawValue() as ISubjectRegister | NewSubjectRegister;
  }

  resetForm(form: SubjectRegisterFormGroup, subjectRegister: SubjectRegisterFormGroupInput): void {
    const subjectRegisterRawValue = { ...this.getFormDefaults(), ...subjectRegister };
    form.reset(
      {
        ...subjectRegisterRawValue,
        id: { value: subjectRegisterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SubjectRegisterFormDefaults {
    return {
      id: null,
    };
  }
}
