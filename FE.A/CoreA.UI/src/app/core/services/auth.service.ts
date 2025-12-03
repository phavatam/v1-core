import { Injectable } from '@angular/core';
import { FetchQueryService } from './fetch-query.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  async login(username: string, password: string): Promise<any> {
    const body = {
      LoginName: username,
      Password: password
    };
    try {
      return await FetchQueryService.post('auth/login', body);
    } catch (err: any) {
      return { isSuccess: false, message: err?.message || 'API error' };
    }
  }
}
