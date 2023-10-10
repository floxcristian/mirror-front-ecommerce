// Angular
import { NgModule } from '@angular/core';
// Pipes
import { CurrencyFormatPipe } from './currency-format.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { CapitalizeFirstPipe } from './capitalize.pipe';
import { MonedaPipe } from './moneda.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ReplacePipe } from './replace.pipe';

const PIPES = [
  CurrencyFormatPipe,
  SlugifyPipe,
  CapitalizeFirstPipe,
  MonedaPipe,
  SafeHtmlPipe,
  ReplacePipe,
];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
  providers: [SlugifyPipe, CapitalizeFirstPipe, CurrencyFormatPipe],
})
export class PipesModule {}
