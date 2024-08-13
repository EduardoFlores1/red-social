import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CardPublicacionComponent } from '../../../../shared/components/card-publicacion/card-publicacion.component';



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
export class InicioComponent {

}
