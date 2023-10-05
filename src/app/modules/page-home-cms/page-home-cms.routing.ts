// Angular
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Pages
import { PageHomeComponent } from './page/page-home/page-home.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'page-home',
  },
  {
    path: 'page-home',
    component: PageHomeComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageHomeCmsRoutesModule {}
