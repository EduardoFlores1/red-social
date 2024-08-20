import { Component, inject, Input, signal } from '@angular/core';
import { Publication } from '../../../core/models/publications.model';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { LikecountService } from '../../../core/services/likecount.service';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-card-publicacion',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './card-publicacion.component.html',
  styleUrl: './card-publicacion.component.scss'
})
export class CardPublicacionComponent {
  
  @Input({required: true}) publicacion!: Publication;

  private _userService = inject(UserService);
  private _likecountService = inject(LikecountService);

  private onDestroy$: Subscription = new Subscription;

  userPerfil = signal<User | null>(null);
  likeCounts = signal<number>(0);

  ngOnInit(): void {
    this.loadUserPublication();
    this.loadLikesCountPublication();
  }

  ngOnDestroy(): void {
    this.onDestroy$.unsubscribe();
  }

  private loadUserPublication() {
    this._userService.getUserById(this.publicacion.user_id)
      .then(user => this.userPerfil.set(user))
      .catch(error => console.log(error));
  }

  private loadLikesCountPublication() {
    this.onDestroy$.add(
      this._likecountService.getLikeCountsOnChange(this.publicacion.id!)
      .onSnapshot(
        snapshot => {
          if(!snapshot.empty) {
            this.likeCounts.set(snapshot.docs[0].data().count);
          }else {
            console.log('like doc vacio de pub')
          }
        },
        error => console.log(error)
      )
    );
  }
}
