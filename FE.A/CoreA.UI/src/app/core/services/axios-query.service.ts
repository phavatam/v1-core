
import { environment } from '../global-variables';

export class AxiosQueryService {
  static async get<T>(endpoint: string, params?: any): Promise<T> {
    let url = `${environment.apiUrl}/${endpoint}`;
    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${environment.apiUrl}/${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  // Có thể bổ sung các phương thức put, delete nếu cần
}
