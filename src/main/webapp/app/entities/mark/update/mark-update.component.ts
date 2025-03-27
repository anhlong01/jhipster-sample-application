import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISubjectRegister } from 'app/entities/subject-register/subject-register.model';
import { SubjectRegisterService } from 'app/entities/subject-register/service/subject-register.service';
import { IMark } from '../mark.model';
import { MarkService } from '../service/mark.service';
import { MarkFormGroup, MarkFormService } from './mark-form.service';

@Component({
  selector: 'jhi-mark-update',
  templateUrl: './mark-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MarkUpdateComponent implements OnInit {
  isSaving = false;
  mark: IMark | null = null;

  subjectRegistersCollection: ISubjectRegister[] = [];

  protected markService = inject(MarkService);
  protected markFormService = inject(MarkFormService);
  protected subjectRegisterService = inject(SubjectRegisterService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MarkFormGroup = this.markFormService.createMarkFormGroup();

  compareSubjectRegister = (o1: ISubjectRegister | null, o2: ISubjectRegister | null): boolean =>
    this.subjectRegisterService.compareSubjectRegister(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mark }) => {
      this.mark = mark;
      if (mark) {
        this.updateForm(mark);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mark = this.markFormService.getMark(this.editForm);
    if (mark.id !== null) {
      this.subscribeToSaveResponse(this.markService.update(mark));
    } else {
      this.subscribeToSaveResponse(this.markService.create(mark));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMark>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(mark: IMark): void {
    this.mark = mark;
    this.markFormService.resetForm(this.editForm, mark);

    this.subjectRegistersCollection = this.subjectRegisterService.addSubjectRegisterToCollectionIfMissing<ISubjectRegister>(
      this.subjectRegistersCollection,
      mark.subjectRegister,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.subjectRegisterService
      .query({ filter: 'mark-is-null' })
      .pipe(map((res: HttpResponse<ISubjectRegister[]>) => res.body ?? []))
      .pipe(
        map((subjectRegisters: ISubjectRegister[]) =>
          this.subjectRegisterService.addSubjectRegisterToCollectionIfMissing<ISubjectRegister>(
            subjectRegisters,
            this.mark?.subjectRegister,
          ),
        ),
      )
      .subscribe((subjectRegisters: ISubjectRegister[]) => (this.subjectRegistersCollection = subjectRegisters));
  }
}
