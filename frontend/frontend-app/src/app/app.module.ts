import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent  // ← Importar el componente en lugar de declararlo
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }