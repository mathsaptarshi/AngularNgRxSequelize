import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from '../../state/auth.actions';
import { selectCurrentUser } from '../../state/auth.selectors';

@Component({
imports: [CommonModule],  selector: 'app-admin-dashboard',
  styleUrl: './admin-dashboard.scss',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit{
  private store = inject(Store);
  private authService = inject(AuthService);

  user$ = this.store.select(selectCurrentUser);
  adminData: any;

  ngOnInit(): void {
    this.authService.getAdminDashboard().subscribe({
      next: (data) => (this.adminData = data),
      error: (err) => (this.adminData = err),
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
