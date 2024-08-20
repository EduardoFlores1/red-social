import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CardPublicacionComponent } from '../../../../shared/components/card-publicacion/card-publicacion.component';
import { PublicacionesService } from '../../../../core/services/publicaciones.service';
import { Publication } from '../../../../core/models/publications.model';
import { Subscription } from 'rxjs';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CardPublicacionComponent,
    ProgressSpinnerComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit, OnDestroy {

  private _pubService = inject(PublicacionesService);

  private onDestroy$: Subscription = new Subscription;
  sigPubList = signal<Publication[]>([]);
  sigSpinnerStatus = signal<boolean>(false);

  ngOnInit(): void {
    this.getPublicaciones();
  }

  ngOnDestroy(): void {
    this.onDestroy$.unsubscribe();
  }

  private getPublicaciones() {
    this.onDestroy$.add(
      this._pubService.getAll().onSnapshot(
        snapshots => {
          const list = snapshots.docs.map(snapshot => ({id: snapshot.id, ...snapshot.data()}) as Publication)
          this.sigPubList.set(list);
          this.sigSpinnerStatus.set(true);
        },
        error => {
          console.log(error)
        }
      )
    );
  }
}
