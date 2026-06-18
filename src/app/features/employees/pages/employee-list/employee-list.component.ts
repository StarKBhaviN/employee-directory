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
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  readonly store = inject(EmployeeStoreService);
  private readonly dialog = inject(MatDialog);
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.store.loadEmployees().subscribe();

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
        this.store.deleteEmployee(employee.id).subscribe();
      }
    });
  }
}
