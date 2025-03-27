import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISubjectRegister } from '../subject-register.model';
import { SubjectRegisterService } from '../service/subject-register.service';

@Component({
  templateUrl: './subject-register-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SubjectRegisterDeleteDialogComponent {
  subjectRegister?: ISubjectRegister;

  protected subjectRegisterService = inject(SubjectRegisterService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subjectRegisterService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
