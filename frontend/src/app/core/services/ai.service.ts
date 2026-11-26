import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiService {
  private apiUrl = 'http://localhost:5000/api/ai';

  constructor(private http: HttpClient) {}

breakdown(task: string, provider: 'gemini' | 'grok') {
  return this.http
    .post<{ provider: string; subtasks: string[] }>(this.apiUrl, { task, provider })
    .pipe(timeout(30000));
}
}