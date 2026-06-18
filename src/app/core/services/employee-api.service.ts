import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Employee } from '../../features/employees/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly baseUrl = 'https://task-manager-dd072-default-rtdb.firebaseio.com';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Employee[]> {
    return this.http.get<Record<string, Omit<Employee, 'id'>> | null>(
      `${this.baseUrl}/employees.json`
    ).pipe(
      map(data => {
        if (!data) return [];
        return Object.entries(data).map(([id, emp]) => ({ ...emp, id }));
      })
    );
  }

  create(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<{ name: string }>(
      `${this.baseUrl}/employees.json`,
      employee
    ).pipe(
      map(res => ({ ...employee, id: res.name }))
    );
  }

  update(employee: Employee): Observable<Employee> {
    const { id, ...data } = employee;
    return this.http.put<Omit<Employee, 'id'>>(
      `${this.baseUrl}/employees/${id}.json`,
      data
    ).pipe(
      map(updated => ({ ...updated, id }))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/employees/${id}.json`
    );
  }
}
