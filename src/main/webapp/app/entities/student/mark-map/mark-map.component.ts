import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { StudentService } from '../service/student.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-mark-map',
  imports: [SharedModule],
  templateUrl: './mark-map.component.html',
  styleUrl: './mark-map.component.scss',
})
export class MarkMapComponent {
  markMap: { [key: string]: number } = {};
  studentService: StudentService = inject(StudentService);
  route: ActivatedRoute = inject(ActivatedRoute);
  error: String = '';
  Object = Object;
  constructor() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.fetchMarkById(id);
  }

  fetchMarkById(id: number): void {
    this.studentService.getMarkById(id).subscribe({
      next: (response: HttpResponse<{ [key: string]: number }>) => {
        this.markMap = response.body || {};
        console.log(this.markMap);
      },
      error: error => {
        this.error = error.error.detail;
        console.log('Error fetching mark: ', this.error);
      },
    });
  }
}
