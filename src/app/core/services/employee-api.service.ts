import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, NewEmployee } from '../../features/employees/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly baseUrl = 'http://localhost:3000/employees';
  private readonly http = inject(HttpClient);

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  create(employee: NewEmployee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  update(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${employee.id}`, employee);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
