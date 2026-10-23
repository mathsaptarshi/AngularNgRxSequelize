import { Component, signal,  OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './state/auth.actions';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit{
  protected readonly title = signal('AngularNgRx');
  private store = inject(Store);

  ngOnInit(): void {
    // Rehydrate user session from localStorage if present
    this.store.dispatch(AuthActions.restoreSession());
  }
}
