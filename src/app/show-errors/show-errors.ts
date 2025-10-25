import { Component, input } from '@angular/core';

@Component({
  selector: 'app-show-errors',
  standalone: true,
  imports: [],
  templateUrl: './show-errors.html',
  styleUrl: './show-errors.css'
})
export class ShowErrors {

  errors = input<string[]>([]);

}
