import { Injectable } from '@angular/core';
import { Employee } from '../../features/employees/models/employee.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly STORAGE_KEY = 'employees';

  saveEmployees(employees: Employee[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
    } catch {
      console.error('Failed to save to localStorage');
    }
  }

  getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) as Employee[] : [];
    } catch {
      console.error('Failed to read from localStorage');
      return [];
    }
  }

  clearEmployees(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
