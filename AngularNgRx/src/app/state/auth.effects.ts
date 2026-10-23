import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          switchMap(({ token }) => {
            localStorage.setItem('token', token);
            return this.authService.getProfile().pipe(
              map(({ user: profileUser }) => {
                const user = profileUser;
                localStorage.setItem('user', JSON.stringify(user));
                return AuthActions.loginSuccess({ user, token });
              }),
              catchError((err) => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return of(
                  AuthActions.loginFailure({
                    error: err.error?.message || 'Unable to load user profile',
                  })
                );
              })
            );
          }),
          catchError((err) =>
            of(AuthActions.loginFailure({ error: err.error?.message || 'Login failed' }))
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((payload) =>
        this.authService.register(payload).pipe(
          map((res) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            return AuthActions.registerSuccess({ user: res.user, token: res.token });
          }),
          catchError((err) =>
            of(AuthActions.registerFailure({ error: err.error?.message || 'Registration failed' }))
          )
        )
      )
    )
  );

  authSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          if (user.role === 'admin') this.router.navigate(['/admin']);
          else this.router.navigate(['/unauthorized']);
        })
      ),
    { dispatch: false }
  );

  registerSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ user }) => {
          if (user.role === 'admin') this.router.navigate(['/admin']);
          else if (user.role === 'captain') this.router.navigate(['/captain']);
          else this.router.navigate(['/customer']);
        })
      ),
    { dispatch: false }
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      map(() => {
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        if (token && userJson) {
          return AuthActions.loginSuccess({ user: JSON.parse(userJson), token });
        }
        return AuthActions.logout();
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}