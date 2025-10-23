import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class ReactiveForm {

  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      biograph: [''],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9\s-]+$/)]],
      username: ['', Validators.required],
      birthday: ['', Validators.required]
    });
  }

  onSubmit(): void {

    if (this.profileForm.valid) {
      alert('Profile Data: ' + JSON.stringify(this.profileForm.value));
    } else {
      alert('Form is invalid');
    }
  }
}
