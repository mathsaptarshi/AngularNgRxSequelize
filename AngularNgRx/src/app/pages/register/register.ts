import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../state/auth.selectors';
import { UserRole } from '../../core/models/user.model';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['customer' as UserRole, [Validators.required]],
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password, role } = this.registerForm.getRawValue();

      this.store.dispatch(
        AuthActions.register({
          name: name!,
          email: email!,
          password: password!,
          role: role!,
        })
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
