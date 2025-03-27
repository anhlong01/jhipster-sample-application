import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISubject } from '../subject.model';
import { SubjectService } from '../service/subject.service';
import { SubjectFormGroup, SubjectFormService } from './subject-form.service';

@Component({
  selector: 'jhi-subject-update',
  templateUrl: './subject-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SubjectUpdateComponent implements OnInit {
  isSaving = false;
  subject: ISubject | null = null;

  protected subjectService = inject(SubjectService);
  protected subjectFormService = inject(SubjectFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SubjectFormGroup = this.subjectFormService.createSubjectFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subject }) => {
      this.subject = subject;
      if (subject) {
        this.updateForm(subject);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subject = this.subjectFormService.getSubject(this.editForm);
    if (subject.id !== null) {
      this.subscribeToSaveResponse(this.subjectService.update(subject));
    } else {
      this.subscribeToSaveResponse(this.subjectService.create(subject));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubject>>): void {
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

  protected updateForm(subject: ISubject): void {
    this.subject = subject;
    this.subjectFormService.resetForm(this.editForm, subject);
  }
}
