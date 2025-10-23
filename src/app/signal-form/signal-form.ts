import { Component, signal } from '@angular/core';
import {
  form,
  schema,
  required,
  minLength,
  validate,
  submit,
  FieldPath,
  ValidationError,
} from '@angular/forms/signals';


type Profile = {
  firstName: string;
  lastName: string;
  biograph: string;
  phoneNumber: string;
  username: string;
  birthday: string;
};

// Reusable phone validator using a regex

// Define a schema for validation rules
const profileSchema = schema<Profile>((p) => {
  required(p.firstName, { message: 'First name is required.' });
  required(p.lastName, { message: 'Last name is required.' });
  required(p.username, { message: 'Username is required.' });
  minLength(p.username, 3, { message: 'Username must be at least 3 characters.' });

  // biography is optional; add a gentle min length if filled
});


@Component({
  selector: 'app-signal-form',
  imports: [],
  templateUrl: './signal-form.html',
  styleUrl: './signal-form.css',
})
export class SignalForm {

  private initial = signal<Profile>({
    firstName: '',
    lastName: '',
    biograph: '',
    phoneNumber: '',
    username: '',
    birthday: '',
  });

  profileForm = form(this.initial, profileSchema);

}
