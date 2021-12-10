import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: `game/:id`,
    loadChildren: () => import('./game/game.module').then((m) => m.GameModule),
  },
  {
    path: `multiplayer`,
    loadChildren: () =>
      import('./multiplayer/multiplayer.module').then(
        (m) => m.MultiplayerModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
