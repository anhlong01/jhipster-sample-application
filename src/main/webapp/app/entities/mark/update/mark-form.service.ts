import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IMark, NewMark } from '../mark.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMark for edit and NewMarkFormGroupInput for create.
 */
type MarkFormGroupInput = IMark | PartialWithRequiredKeyOf<NewMark>;

type MarkFormDefaults = Pick<NewMark, 'id'>;

type MarkFormGroupContent = {
  id: FormControl<IMark['id'] | NewMark['id']>;
  score: FormControl<IMark['score']>;
  subjectRegister: FormControl<IMark['subjectRegister']>;
};

export type MarkFormGroup = FormGroup<MarkFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MarkFormService {
  createMarkFormGroup(mark: MarkFormGroupInput = { id: null }): MarkFormGroup {
    const markRawValue = {
      ...this.getFormDefaults(),
      ...mark,
    };
    return new FormGroup<MarkFormGroupContent>({
      id: new FormControl(
        { value: markRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      score: new FormControl(markRawValue.score),
      subjectRegister: new FormControl(markRawValue.subjectRegister),
    });
  }

  getMark(form: MarkFormGroup): IMark | NewMark {
    return form.getRawValue() as IMark | NewMark;
  }

  resetForm(form: MarkFormGroup, mark: MarkFormGroupInput): void {
    const markRawValue = { ...this.getFormDefaults(), ...mark };
    form.reset(
      {
        ...markRawValue,
        id: { value: markRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MarkFormDefaults {
    return {
      id: null,
    };
  }
}
