import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { GameDTO } from 'src/app/models/game/game.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss'],
})
export class MultiplayerComponent implements OnInit, OnDestroy {
  private topicSubscription: Subscription;
  public game: GameDTO;

  constructor(
    private readonly rxStompService: RxStompService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.topicSubscription = this.rxStompService
      .watch('/topic/test')
      .subscribe((message: Message) => {
        this.game = JSON.parse(message.body).body;
        console.log(this.game);
      });
  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
  }

  public test(): void {
    this.rxStompService.publish({
      destination: '/hello',
      headers: { Authorization: this.userService.getJWTToken() },
    });
  }
}
