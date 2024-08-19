import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CardPublicacionComponent } from '../../../../shared/components/card-publicacion/card-publicacion.component';
import { PublicacionesService } from '../../../../core/services/publicaciones.service';
import { Publication } from '../../../../core/models/publications.model';



@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CardPublicacionComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit, OnDestroy {

  private _pubService = inject(PublicacionesService);

  sigPubList = signal<Publication[]>([]);

  ngOnInit(): void {
    this.getPublicaciones();
  }

  ngOnDestroy(): void {
    
  }

  private getPublicaciones() {
    this._pubService.getAll()
      .then(list => {
        this.sigPubList.set(list);
      })
      .catch(err => console.log('Error: ', err))
  }
}
