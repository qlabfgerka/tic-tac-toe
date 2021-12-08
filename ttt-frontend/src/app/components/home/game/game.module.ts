import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, GameRoutingModule, MatButtonModule],
})
export class GameModule {}
