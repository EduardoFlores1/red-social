import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBarComponent } from '../../../shared/components/progress-bar/progress-bar.component';
import { ProgressRequestService } from '../../services/progress-request.service';


@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ProgressBarComponent
  ],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {

  private _progresRequestService = inject(ProgressRequestService);

  showProgress = this._progresRequestService.showProgress;
}
