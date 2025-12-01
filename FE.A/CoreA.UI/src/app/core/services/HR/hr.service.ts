import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from '../../../../environments/global-variables'
import { map } from 'rxjs/operators';

export interface UserDTORequest {
    keyword: string;
}

export interface UserDTOResponse {
    id: string;
    loginName: string;
    fullName: string;
    email: string;
    isActive: boolean;
    gender: number;
}

export interface ResultDTO<T> {
    isSuccess: boolean;
    statusCode: number;
    data: T;
    message: string;
    traceId: string;
}

export interface PagedResultDTO<T> {
    items: T[];
    totalItems: number;
    pageSize: number;
    pageNumber: number;
}


@Injectable({
    providedIn: 'root'
})
export class HRService {
    private url = environment.apiUrl; // Thay thế bằng URL thực tế của API
    constructor(private http: HttpClient) { }

    // getUsers(): Observable<ResultDTO<PagedResultDTO<UserDTOResponse>>> {
    //     return this.http.get<ResultDTO<PagedResultDTO<UserDTOResponse>>>(`${this.url}/user/users`); // Replace with your API endpoint
    // }

    // getListUsers(user: UserDTORequest): Observable<ResultDTO<PagedResultDTO<UserDTOResponse>>> {
    //     return this.http.post<ResultDTO<PagedResultDTO<UserDTOResponse>>>(`${this.url}/user/get-list`, user);
    // }

    // deleteUser(id: string): Observable<ResultDTO<null>> {
    //     return this.http.delete<ResultDTO<null>>(`${this.url}/user/${id}`);
    // }

    // updateUser(user: UserDTOResponse): Observable<ResultDTO<null>> {
    //     return this.http.put<ResultDTO<null>>(`${this.url}/user`, user);
    // }


    // Phương thức trợ giúp để xử lý Fetch và bọc trong Observable
    private fetchAsObservable<T>(endpoint: string, options: RequestInit = {}): Observable<T> {
        const fullUrl = `${this.url}${endpoint}`;

        // Tạo một Promise cho Fetch request
        const fetchPromise = fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                // Thêm Authorization token nếu cần:
                // 'Authorization': `Bearer ${token}` 
            }
        }).then(response => {
            if (!response.ok) {
                // Xử lý lỗi HTTP status (4xx, 5xx)
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            // Nếu DELETE request (hoặc request không trả về body), trả về null/void
            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return null as T;
            }

            return response.json(); // Phân tích JSON body
        });

        // Sử dụng 'from' của RxJS để biến Promise thành Observable
        return from(fetchPromise) as Observable<T>;
    }


    // 1. GET (Không tham số)
    // getUsers(): Observable<ResultDTO<PagedResultDTO<UserDTOResponse>>>
    getUsers(): Observable<ResultDTO<PagedResultDTO<UserDTOResponse>>> {
        return this.fetchAsObservable<ResultDTO<PagedResultDTO<UserDTOResponse>>>(
            `/user/users`,
            { method: 'GET' }
        );
    }

    // 2. POST (Với body request)
    // getListUsers(user: UserDTORequest): Observable<ResultDTO<PagedResultDTO<UserDTOResponse>>>
    getListUsers(user: UserDTORequest): Observable<ResultDTO<PagedResultDTO<UserDTOResponse>>> {
        return this.fetchAsObservable<ResultDTO<PagedResultDTO<UserDTOResponse>>>(
            `/user/get-list`,
            {
                method: 'POST',
                body: JSON.stringify(user)
            }
        );
    }

    // 3. DELETE (Với path parameter)
    // deleteUser(id: string): Observable<ResultDTO<null>>
    deleteUser(id: string): Observable<ResultDTO<null>> {
        return this.fetchAsObservable<ResultDTO<null>>(
            `/user/${id}`,
            { method: 'DELETE' }
        );
    }

    // 4. PUT (Với body request)
    // updateUser(user: UserDTOResponse): Observable<ResultDTO<null>>
    updateUser(user: UserDTOResponse): Observable<ResultDTO<null>> {
        return this.fetchAsObservable<ResultDTO<null>>(
            `/user`,
            {
                method: 'PUT',
                body: JSON.stringify(user)
            }
        );
    }
}