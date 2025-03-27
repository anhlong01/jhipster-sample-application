import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { ISubject } from 'app/entities/subject/subject.model';
import { SubjectService } from 'app/entities/subject/service/subject.service';
import { SubjectRegisterService } from '../service/subject-register.service';
import { ISubjectRegister } from '../subject-register.model';
import { SubjectRegisterFormGroup, SubjectRegisterFormService } from './subject-register-form.service';

@Component({
  selector: 'jhi-subject-register-update',
  templateUrl: './subject-register-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SubjectRegisterUpdateComponent implements OnInit {
  isSaving = false;
  subjectRegister: ISubjectRegister | null = null;

  studentsSharedCollection: IStudent[] = [];
  subjectsSharedCollection: ISubject[] = [];

  protected subjectRegisterService = inject(SubjectRegisterService);
  protected subjectRegisterFormService = inject(SubjectRegisterFormService);
  protected studentService = inject(StudentService);
  protected subjectService = inject(SubjectService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SubjectRegisterFormGroup = this.subjectRegisterFormService.createSubjectRegisterFormGroup();

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  compareSubject = (o1: ISubject | null, o2: ISubject | null): boolean => this.subjectService.compareSubject(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subjectRegister }) => {
      this.subjectRegister = subjectRegister;
      if (subjectRegister) {
        this.updateForm(subjectRegister);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subjectRegister = this.subjectRegisterFormService.getSubjectRegister(this.editForm);
    if (subjectRegister.id !== null) {
      this.subscribeToSaveResponse(this.subjectRegisterService.update(subjectRegister));
    } else {
      this.subscribeToSaveResponse(this.subjectRegisterService.create(subjectRegister));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubjectRegister>>): void {
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

  protected updateForm(subjectRegister: ISubjectRegister): void {
    this.subjectRegister = subjectRegister;
    this.subjectRegisterFormService.resetForm(this.editForm, subjectRegister);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      subjectRegister.student,
    );
    this.subjectsSharedCollection = this.subjectService.addSubjectToCollectionIfMissing<ISubject>(
      this.subjectsSharedCollection,
      subjectRegister.subject,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) =>
          this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.subjectRegister?.student),
        ),
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.subjectService
      .query()
      .pipe(map((res: HttpResponse<ISubject[]>) => res.body ?? []))
      .pipe(
        map((subjects: ISubject[]) =>
          this.subjectService.addSubjectToCollectionIfMissing<ISubject>(subjects, this.subjectRegister?.subject),
        ),
      )
      .subscribe((subjects: ISubject[]) => (this.subjectsSharedCollection = subjects));
  }
}
