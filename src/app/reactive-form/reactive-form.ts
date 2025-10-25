import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ShowErrors } from '../show-errors/show-errors';

// CUSTOM VALIDATORS

export const phoneNumberValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  return Validators.pattern(/^\+?[0-9\s-]+$/)(control)
    ? { phoneNumber: true }
    : null;
};

export function matchValidator(
  matchTo: string,
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl):
    ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (
        control.parent?.controls as Record<string, AbstractControl>
      )[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value ===
      (
        control.parent?.controls as Record<string, AbstractControl>
      )[matchTo].value
      ? null
      : { matching: true };
  };
}

// COMPONENT


@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.html',
  standalone: true,
  imports: [ReactiveFormsModule, ShowErrors]
})
export class ReactiveForm {

  profileForm: FormGroup;

  errorMessages: Record<string, Record<string, string>> = {
    firstName: {
      required: 'First name is required.',
      minlength: 'First name must be at least 2 characters.'
    },
    lastName: {
      required: 'Last name is required.',
      minlength: 'Last name must be at least 2 characters.'
    },
    biograph: {
      maxlength: 'Biography cannot exceed 200 characters.'
    },
    phoneNumber: {
      phoneNumber: 'Enter a valid phone number.'
    },
    username: {
      required: 'Username is required.',
      minlength: 'Username must be at least 3 characters.'
    },
    birthday: {
      required: 'Birthday is required.'
    },
    password: {
      required: 'Password is required.',
      matching: 'Passwords must match.'
    },
    confirmPassword: {
      required: 'Confirm password is required.',
      matching: 'Passwords must match.'
    }
  };

  constructor(private fb: FormBuilder) {

    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      biograph: ['', Validators.maxLength(200)],
      phoneNumber: ['', phoneNumberValidator],
      username: ['', [Validators.required, Validators.minLength(3)]],
      birthday: ['', Validators.required],
      password: ['', [Validators.required, matchValidator('confirmPassword', true)]],
      confirmPassword: ['', [Validators.required, matchValidator('password')]]
    });
  }


  onSubmit(): void {

    if (this.profileForm.valid) {
      alert('Profile Data: ' + JSON.stringify(this.profileForm.value));
    } else {
      alert('Form is invalid');
    }
  }


  getErrors(controlName: string): string[] {
    const control = this.profileForm.get(controlName);
    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return [];
    }

    const messagesForField = this.errorMessages[controlName] ?? {};
    return Object.keys(control.errors)
      .map(key => messagesForField[key])
      .filter((msg): msg is string => !!msg);
  }
}
