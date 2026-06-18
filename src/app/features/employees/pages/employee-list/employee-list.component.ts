import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { EmployeeStoreService } from '../../../../core/services/employee-store.service';
import { Employee } from '../../models/employee.model';
import { EmployeeFilterComponent } from '../../components/employee-filter/employee-filter.component';
import { EmployeeTableComponent } from '../../components/employee-table/employee-table.component';
import { DeleteConfirmDialogComponent } from '../../components/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    EmployeeFilterComponent,
    EmployeeTableComponent
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Employees</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-employee-filter
          [searchTerm]="store.searchTerm()"
          [statusFilter]="store.statusFilter()"
          [sortDirection]="store.sortDirection()"
          (searchChange)="onSearchChange($event)"
          (statusFilterChange)="store.setStatusFilter($event)"
          (sortChange)="store.setSortDirection($event)"
        />

        @if (store.loading()) {
          <div class="spinner-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else {
          <app-employee-table
            [employees]="store.filteredEmployees()"
            (deleteRequest)="onDeleteRequest($event)"
          />
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    mat-card {
      margin-bottom: 16px;
    }
  `]
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  readonly store = inject(EmployeeStoreService);
  private readonly dialog = inject(MatDialog);
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.store.loadEmployees();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.store.setSearchTerm(term);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onDeleteRequest(employee: Employee): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.deleteEmployee(employee.id);
      }
    });
  }
}
