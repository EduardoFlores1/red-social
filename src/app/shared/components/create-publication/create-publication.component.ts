import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { SnackbarRequestService } from '../../../core/services/snackbar-request.service';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-create-publication',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogClose,
    ReactiveFormsModule,
    ProgressSpinnerComponent
  ],
  templateUrl: './create-publication.component.html',
  styleUrl: './create-publication.component.scss'
})
export class CreatePublicationComponent {

  private _publicationService = inject(PublicacionesService);
  private _userService = inject(UserService);
  private _snackBarService = inject(SnackbarRequestService);

  fileName = signal<string | null>(null);
  file = signal<any | null>(null);
  progressSpinnerStatus = signal<boolean>(false);

  inputTitle = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]);

  constructor(private dialogRef: MatDialogRef<CreatePublicationComponent>) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if(file) {
      if(file.type != 'video/mp4') {
        this._snackBarService.open('El archivo debe ser video/mp4', 'Info');
        return;
      }
      const fileSizeMB = file.size / (1024 * 1024)
      if( fileSizeMB > 10) {
        this._snackBarService.open('El video excede los 10 MB', 'Info');
        return;
      }

      this.fileName.set(file.name);
      this.file.set(file);

    }else {
      this.fileName.set(null);
      this.file.set(null);
    }
  }

  uploadFile() {
    if(this.inputTitle.valid && this.file()) {
      const titlePublication = this.inputTitle.value;
      const idUser = this._userService.currentUserDoc()?.id;

      this.progressSpinnerStatus.set(true);
      this.inputTitle.disable()
      this._publicationService.create(titlePublication!, idUser!, this.file())
        .then(() => {
          this.dialogRef.close();
        })
        .catch(error => console.log(error))
        .finally(() => {
          this.progressSpinnerStatus.set(false);
          this.inputTitle.enable()
        });
    }
  }
}
