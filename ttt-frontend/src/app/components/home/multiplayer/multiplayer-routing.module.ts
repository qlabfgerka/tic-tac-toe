import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiplayerComponent } from './multiplayer.component';

const routes: Routes = [{ path: '', component: MultiplayerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiplayerRoutingModule {}
