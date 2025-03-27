import { Component, inject } from '@angular/core';
import { StudentService } from '../service/student.service';
import { ActivatedRoute } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'jhi-subject-list',
  imports: [SharedModule],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss',
})
export class SubjectListComponent {
  subjectList: String[] = [];
  studentService: StudentService = inject(StudentService);
  route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.fetchSubjectById(id);
  }

  fetchSubjectById(id: number): void {
    this.studentService.getSubjectById(id).subscribe({
      next: (response: HttpResponse<String[]>) => {
        this.subjectList = response.body || [];
        console.log(this.subjectList);
      },
      error: error => {
        console.log('Error fetching subjects: ', error);
      },
    });
  }
}
