import { Component, inject, resource, signal } from '@angular/core';
import {
  form,
  schema,
  required,
  minLength,
  validate,
  submit,
  customError,
  maxLength,
  pattern,
  validateAsync
} from '@angular/forms/signals';
import { Field } from '@angular/forms/signals';
import { ShowErrors } from '../show-errors/show-errors';
import { USERNAME_VALIDATOR } from '../username-token';


// CUSTOM VALIDATORS

export function usernameAvailable(
  field: Parameters<typeof pattern>[0],
  delayMs = 400,
  opts?: { message?: string }
) {

  const checkUsername = inject(USERNAME_VALIDATOR);

  return validateAsync(field, {
    params: (ctx) => ({
      value: ctx.value()
    }),
    factory: (params) => {
      let timer: ReturnType<typeof setTimeout>;
      return resource({
        params,
        loader: async (p) => {
          const value = p.params.value;
          clearTimeout(timer);
          return new Promise<boolean>((resolve) => {
            timer = setTimeout(async () => {
              const available = await checkUsername(value);
              resolve(available);
            }, delayMs);
          });
        }
      })
    },
    errors: (result) => {
      if (!result) {
        return {
          kind: 'taken',
          message: opts?.message ?? 'This username is already taken.'
        };
      }
      return null;
    }
  });
}

export function phoneNumber(
  field: Parameters<typeof pattern>[0],
  opts?: { message?: string }
) {
  return pattern(field, /^\+?[0-9\s-]+$/, {
    error: customError({
      kind: 'phoneNumber',
      message: opts?.message ?? 'Invalid phone number format.'
    })
  });
}

export function matchField<T>(
  field: Parameters<typeof validate<T>>[0],
  matchToField: Parameters<typeof validate<T>>[0],
  opts?: {
    message?: string;
  }
) {
  return validate(field, (ctx) => {

    const thisVal = ctx.value();
    const otherVal = ctx.valueOf(matchToField);

    if (thisVal === otherVal) {
      return null;
    }

    return customError({
      kind: 'matching',
      message: opts?.message ?? 'Values must match.'
    });
  });
}

// SCHEMA AND COMPONENT

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
  matchField(p.confirmPassword, p.password, {
    message: 'Passwords must match.'
  });
  usernameAvailable(p.username, 400, {
    message: 'This username is already taken.'
  });
});


@Component({
  selector: 'app-signal-form',
  imports: [Field, ShowErrors],
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
