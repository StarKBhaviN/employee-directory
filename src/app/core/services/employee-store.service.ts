import { Injectable, inject, signal, computed } from '@angular/core';
import { Employee } from '../../features/employees/models/employee.model';
import { EmployeeApiService } from './employee-api.service';
import { LocalStorageService } from './local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeStoreService {
  private readonly api = inject(EmployeeApiService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly snackBar = inject(MatSnackBar);

  // State signals
  private readonly employeesSignal = signal<Employee[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly searchTermSignal = signal<string>('');
  private readonly statusFilterSignal = signal<string>('All');
  private readonly sortDirectionSignal = signal<'asc' | 'desc'>('asc');

  // Public readonly signals
  readonly loading = this.loadingSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();
  readonly statusFilter = this.statusFilterSignal.asReadonly();
  readonly sortDirection = this.sortDirectionSignal.asReadonly();

  // Computed filtered and sorted employees
  readonly filteredEmployees = computed(() => {
    let employees = this.employeesSignal();
    const search = this.searchTermSignal().toLowerCase();
    const filter = this.statusFilterSignal();
    const sort = this.sortDirectionSignal();

    // Filter by search term
    if (search) {
      employees = employees.filter(e =>
        e.fullName.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (filter !== 'All') {
      employees = employees.filter(e => e.status === filter);
    }

    // Sort by name
    employees = [...employees].sort((a, b) => {
      const comparison = a.fullName.localeCompare(b.fullName);
      return sort === 'asc' ? comparison : -comparison;
    });

    return employees;
  });

  async loadEmployees(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const employees = await firstValueFrom(this.api.getAll());
      this.employeesSignal.set(employees);
      this.localStorage.saveEmployees(employees);
    } catch {
      // Fallback to localStorage
      const cached = this.localStorage.getEmployees();
      if (cached.length > 0) {
        this.employeesSignal.set(cached);
        this.showMessage('Loaded from local cache');
      } else {
        this.showMessage('Failed to load employees', true);
      }
    } finally {
      this.loadingSignal.set(false);
    }
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employeesSignal().find(e => e.id === id);
  }

  async addEmployee(employee: Omit<Employee, 'id'>): Promise<boolean> {
    try {
      const created = await firstValueFrom(this.api.create(employee));
      this.employeesSignal.update(list => [...list, created]);
      this.localStorage.saveEmployees(this.employeesSignal());
      this.showMessage('Employee added successfully');
      return true;
    } catch {
      this.showMessage('Failed to save employee', true);
      return false;
    }
  }

  async updateEmployee(employee: Employee): Promise<boolean> {
    try {
      const updated = await firstValueFrom(this.api.update(employee));
      this.employeesSignal.update(list =>
        list.map(e => e.id === updated.id ? updated : e)
      );
      this.localStorage.saveEmployees(this.employeesSignal());
      this.showMessage('Employee updated successfully');
      return true;
    } catch {
      this.showMessage('Failed to save employee', true);
      return false;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.delete(id));
      this.employeesSignal.update(list => list.filter(e => e.id !== id));
      this.localStorage.saveEmployees(this.employeesSignal());
      this.showMessage('Employee deleted successfully');
      return true;
    } catch {
      this.showMessage('Failed to delete employee', true);
      return false;
    }
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  setStatusFilter(status: string): void {
    this.statusFilterSignal.set(status);
  }

  setSortDirection(direction: 'asc' | 'desc'): void {
    this.sortDirectionSignal.set(direction);
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: isError ? ['error-snackbar'] : []
    });
  }
}
