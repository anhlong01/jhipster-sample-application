import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IMark } from '../mark.model';

@Component({
  selector: 'jhi-mark-detail',
  templateUrl: './mark-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class MarkDetailComponent {
  mark = input<IMark | null>(null);

  previousState(): void {
    window.history.back();
  }
}
