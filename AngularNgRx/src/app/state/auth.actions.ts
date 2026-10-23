import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { User } from '../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),

    'Register': props<{ name: string; email: string; 'password': string; role: string }>(),
    'Register Success': props<{ user: User; token: string }>(),
    'Register Failure': props<{ error: string }>(),

    'Restore Session': emptyProps(),
    'Logout': emptyProps()
  }
})