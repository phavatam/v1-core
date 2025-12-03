import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, from, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../../environments/global-variables'
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; // Thêm import này

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

export interface UserEdoc {
    id: string;
    loginName: string;
    fullName: string;
    email: string;
}


@Injectable({
    providedIn: 'root'
})
export class ITService {
    private currentUserSubject: BehaviorSubject<UserEdoc | null> = new BehaviorSubject<UserEdoc | null>(null);
    public currentUser$: Observable<UserEdoc | null> = this.currentUserSubject.asObservable();

    private url = environment.apiUrl; // Thay thế bằng URL thực tế của API
    private apiUrlFromServer = environment.apiUrlFromServer; // Thay thế bằng URL thực tế của API
    // private uxr = "xouPdbL/QD7LjCCMKdB/9h0nYbgFRPVjMsVj/MXIFMRVjiuWlob/406xOg6yHRWYEbdTknC+XkqKZ/Gwf4IyboUxlh0yESDAXVrJTQ8lG5kc8ZiGOH3ecjwsKnuXX1up";
    // private secrect = "DI9s9JTL4GSTigChfakC1f6vV3Mr2b+BVUuMu0Eyw1Q=";
    // 1. Khai báo thuộc tính
    uxrValue: string = "";
    secrectValue: string = "";

    constructor(
        private http: HttpClient, 
        private route: ActivatedRoute,
        // Inject PLATFORM_ID
        @Inject(PLATFORM_ID) private platformId: Object 
    ) {
        // KIỂM TRA MÔI TRƯỜNG: CHỈ THỰC HIỆN KHI CHẠY TRÊN TRÌNH DUYỆT
        if (isPlatformBrowser(this.platformId)) {
            const windowContext = (window as any);
            this.uxrValue = windowContext.uxr || environment.uxr;
            this.secrectValue = windowContext.secrect || environment.secrect;
        } else {
            // Trường hợp chạy trên server (SSR), lấy giá trị mặc định hoặc từ environment
            this.uxrValue = environment.uxr;
            this.secrectValue = environment.secrect;
            // Hoặc bạn có thể log cảnh báo nếu các biến này bắt buộc phải có
        }
    }
    // Phương thức trợ giúp để xử lý Fetch và bọc trong Observable
    private fetchAsObservable<T>(endpoint: string, options: RequestInit = {}): Observable<T> {
        const fullUrl = `${this.url}${endpoint}`;

        // Tạo một Promise cho Fetch request
        const fetchPromise = fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
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

    private fetchAsObservableFromServer<T>(endpoint: string, options: RequestInit = {}): Observable<T> {
        const fullUrl = `${this.apiUrlFromServer}${endpoint}`;

        // Tạo một Promise cho Fetch request
        const fetchPromise = fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Uxr': this.uxrValue,
                'secret': this.secrectValue
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

        return from(fetchPromise) as Observable<T>;
    }

    getCurrentUser(): Observable<ResultDTO<PagedResultDTO<UserDTOResponse>>> {
        return this.fetchAsObservableFromServer<ResultDTO<PagedResultDTO<UserDTOResponse>>>(
            `/api/User/GetCurrentUser`,
            {
                method: 'GET'
            }
        );
    }

    getCurrentUserFromEdoc(): Observable<any> {
        return this.fetchAsObservableFromServer<any>(
            `/api/User/GetCurrentUser`,
            {
                method: 'GET'
            }
        ).pipe(
            // Tác vụ này là cập nhật BehaviorSubject, nhưng không thay đổi dữ liệu của luồng chính.
            tap(response => {
                if (response.isSuccess && response.object != null) {
                    const user = response.object;
                    this.currentUserSubject.next(user);
                } else {
                    // Xử lý trường hợp không tìm thấy người dùng
                    this.currentUserSubject.next(null);
                    console.warn('API GetCurrentUser không trả về dữ liệu người dùng.');
                }
            })
        );
    }

    //#region API User
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
    //#endregion
}