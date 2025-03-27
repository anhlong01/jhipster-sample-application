import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMark } from '../mark.model';
import { MarkService } from '../service/mark.service';

@Component({
  templateUrl: './mark-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MarkDeleteDialogComponent {
  mark?: IMark;

  protected markService = inject(MarkService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.markService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
