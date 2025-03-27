import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../service/student.service';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'jhi-check-pass',
  imports: [CommonModule],
  templateUrl: './check-pass.component.html',
  styleUrl: './check-pass.component.scss',
})
export class CheckPassComponent {
  error: String = '';
  route: ActivatedRoute = inject(ActivatedRoute);
  studentService: StudentService = inject(StudentService);
  result: String = '';
  constructor() {
    const id = parseInt(this.route.snapshot.params['id'], 10);
    this.checkPassed(id);
  }

  // checkPassed(id: number): void{
  //   this.studentService.checkPassed(id).subscribe({
  //     next: (response: HttpResponse<String>) =>{
  //       this.result = response.body || ""
  //       console.log('Response:', response);
  //       console.log('Response body:', response.body);
  //     }, error: (error)=>{
  //       this.error = error.error.detail
  //     }
  //   })
  // }

  checkPassed(id: number): void {
    this.studentService.checkPassed(id).subscribe({
      next: (response: HttpResponse<String>) => {
        this.result = response.body || ''; // Extract the body from HttpResponse
        console.log('Response:', response);
      },
      error: error => {
        this.error = error.error.detail || 'An error occurred'; // Handle errors
        console.error('Error:', error);
      },
    });
  }
}
