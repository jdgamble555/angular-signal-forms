import { Component, signal } from '@angular/core';
import {
  form,
  schema,
  required,
  minLength,
  validate,
  submit,
  customError,
} from '@angular/forms/signals';
import { Field } from '@angular/forms/signals';


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

  required(p.firstName);
  required(p.lastName);
  required(p.username);
  minLength(p.username, 3);
  required(p.birthday);

  validate(p.phoneNumber, (ctx) => {
    const v = (ctx.value() ?? '').trim();
    if (!v || /^\+?[0-9\s-]+$/.test(v)) return null;
    return customError({
      kind: 'phone',
      message: 'Phone must contain only digits, spaces, dashes, or +',
    });
  });
});


@Component({
  selector: 'app-signal-form',
  imports: [Field],
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

  onSubmit(): void {
    submit(this.profileForm, async (f) => {
      alert('Profile Data: ' + JSON.stringify(f().value()));
      return null;
    });
  }

}
