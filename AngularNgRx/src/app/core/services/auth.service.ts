import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthResponse, User } from "../models/user.model";


@Injectable({
  providedIn:'root'
})

export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  register(credentials: { name: string; email: string; password: string; role: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  getProfile(): Observable<{
    status: string;
    user: User;
  }> {
    return this.http.get<{
      status: string;
      user: User;
    }>(`${this.apiUrl}/profile`);
  }

  getAdminDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dashboard`);
  }

  getCaptainOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/captain/orders`);
  }

  getCustomerOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customer/orders`);
  }
}