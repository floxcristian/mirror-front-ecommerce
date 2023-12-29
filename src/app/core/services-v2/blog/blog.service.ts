// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  /*
  getPosts(quantity: number): Observable<IBlogsResponse> {
    return this.http.get<IBlogsResponse>(`${API_CMS}/blog/posts`, {
      params: { quantity },
    });
  }

  getPostDetail(postId: string): Observable<IBlogResponse> {
    return this.http.get<IBlogResponse>(`${API_CMS}/blog/post/${postId}`);
  }*/
}
