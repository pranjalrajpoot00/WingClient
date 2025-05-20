import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
// ... other imports ...

@NgModule({
  declarations: [
    AppComponent,
    // ... other components ...
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderComponent, // Add HeaderComponent to imports
    // ... other modules ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// ... existing code ... 