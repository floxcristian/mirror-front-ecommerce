// Angular
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
// Modules
import { SharedModule } from '../../shared/shared.module'
// Components
import { ContactsComponent } from './components/contacts/contacts.component'
import { FooterComponent } from './footer.component'
import { LinksComponent } from './components/links/links.component'
import { NewsletterComponent } from './components/newsletter/newsletter.component'

@NgModule({
  declarations: [
    ContactsComponent,
    FooterComponent,
    LinksComponent,
    NewsletterComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [FooterComponent],
})
export class FooterModule {}
