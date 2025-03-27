import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ISubjectRegister } from '../subject-register.model';

@Component({
  selector: 'jhi-subject-register-detail',
  templateUrl: './subject-register-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class SubjectRegisterDetailComponent {
  subjectRegister = input<ISubjectRegister | null>(null);

  previousState(): void {
    window.history.back();
  }
}
