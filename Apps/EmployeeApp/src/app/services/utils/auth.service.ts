import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = !!this.getToken();
      this.authStatus.next(isLoggedIn);
    }
  }

  login(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      
      document.cookie = `jwt=${token}; path=/; Secure; SameSite=Strict`;
      this.authStatus.next(true);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      
      document.cookie = `jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      this.authStatus.next(false);
    }
  }

  checkUserAccessToPage(type:string)
  {
    if(sessionStorage.getItem('accType')===null || sessionStorage.getItem('accType')===undefined || !this.isLoggedIn() || type!==sessionStorage.getItem('accType'))
    {
      window.location.href='error';
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false;
  }

   getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const cookies = document.cookie.split('; ');
      const jwtCookie = cookies.find((row) => row.startsWith('jwt='));
      return jwtCookie ? jwtCookie.split('=')[1] : null;
    }
    return null;
  }
}
