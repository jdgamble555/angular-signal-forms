import { Component, signal } from '@angular/core';
import {
  form,
  schema,
  required,
  minLength,
  validate,
  submit,
  customError,
  maxLength
} from '@angular/forms/signals';
import { Field } from '@angular/forms/signals';

export function phoneNumber<T>(
  field: Parameters<typeof validate<T>>[0],
  opts?: { message?: string }
) {
  return validate(field, (ctx) => {
    const v = ctx.value();
    if (!v || typeof v !== 'string' || /^\+?[0-9\s-]+$/.test(v)) return null;

    return customError({
      kind: 'phoneNumber',
      message: opts?.message
    });
  });
}


type Profile = {
  firstName: string;
  lastName: string;
  biograph: string;
  phoneNumber: string;
  username: string;
  birthday: string;
  password: string;
  confirmPassword: string;
};

// Define a schema for validation rules
const profileSchema = schema<Profile>((p) => {
  required(p.firstName, {
    message: 'First name is required.'
  });
  minLength(p.firstName, 2, {
    message: 'First name must be at least 2 characters.'
  });
  required(p.lastName, {
    message: 'Last name is required.'
  });
  minLength(p.lastName, 2, {
    message: 'Last name must be at least 2 characters.'
  });
  maxLength(p.biograph, 200, {
    message: 'Biography cannot exceed 200 characters.'
  });
  required(p.username, {
    message: 'Username is required.'
  });
  minLength(p.username, 3, {
    message: 'Username must be at least 3 characters.'
  });
  required(p.birthday, {
    message: 'Birthday is required.'
  });
  required(p.phoneNumber, {
    message: 'Phone number is required.'
  });
  required(p.password, {
    message: 'Password is required.'
  });
  required(p.confirmPassword, {
    message: 'Confirm password is required.'
  });
  phoneNumber(p.phoneNumber, {
    message: 'Enter a valid phone number.'
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
    password: '',
    confirmPassword: ''
  });

  profileForm = form(this.initial, profileSchema);

  onSubmit(): void {
    submit(this.profileForm, async (f) => {
      alert('Profile Data: ' + JSON.stringify(f().value()));
      return null;
    });
  }

  getErrors(controlName: keyof typeof this.profileForm): string[] {

    const field = this.profileForm[controlName];

    const state = field();

    // Only show errors after user interaction
    if (!state.touched() && !state.dirty()) return [];

    const errors = state.errors();
    if (!errors) return [];

    return errors
      .map(err => err.message ?? err.kind ?? 'Invalid')
      .filter(Boolean);
  }

}
