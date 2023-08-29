// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// Libs
// import { MetaModule } from '@ngx-meta/core';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
    // MetaModule.forRoot()
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
