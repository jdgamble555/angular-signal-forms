import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
  <div class="pt-5">
    <router-outlet />
  </div>  
  <nav class="flex gap-3 justify-center mt-5">
      <a routerLink="/">Home</a>
      <a routerLink="/reactive-form">Reactive Form</a>
      <a routerLink="/signal-form">Signal Form</a>
  </nav>
  `,
})
export class App{ }
