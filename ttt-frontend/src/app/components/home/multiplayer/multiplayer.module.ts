import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiplayerRoutingModule } from './multiplayer-routing.module';
import { MultiplayerComponent } from './multiplayer.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MultiplayerComponent],
  imports: [CommonModule, MultiplayerRoutingModule, MatButtonModule],
})
export class MultiplayerModule {}
