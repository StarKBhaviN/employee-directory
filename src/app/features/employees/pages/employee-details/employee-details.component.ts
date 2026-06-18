import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Employee } from '../../models/employee.model';
import { EmployeeStoreService } from '../../../../core/services/employee-store.service';
import { DeleteConfirmDialogComponent } from '../../components/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    @if (employee()) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ employee()!.fullName }}</mat-card-title>
          <mat-card-subtitle>Employee Details</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="details-grid">
            <div class="detail-item">
              <strong>Employee ID</strong>
              <span>{{ employee()!.id }}</span>
            </div>
            <div class="detail-item">
              <strong>Full Name</strong>
              <span>{{ employee()!.fullName }}</span>
            </div>
            <div class="detail-item">
              <strong>Email</strong>
              <span>{{ employee()!.email }}</span>
            </div>
            <div class="detail-item">
              <strong>Department</strong>
              <span>{{ employee()!.department }}</span>
            </div>
            <div class="detail-item">
              <strong>Status</strong>
              <span class="status-badge"
                    [class.active]="employee()!.status === 'Active'"
                    [class.inactive]="employee()!.status === 'Inactive'">
                {{ employee()!.status }}
              </span>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button routerLink="/employees">
            <mat-icon>arrow_back</mat-icon> Back
          </button>
          <button mat-raised-button color="primary" [routerLink]="['/employees', employee()!.id, 'edit']">
            <mat-icon>edit</mat-icon> Edit
          </button>
          <button mat-raised-button color="warn" (click)="onDelete()">
            <mat-icon>delete</mat-icon> Delete
          </button>
        </mat-card-actions>
      </mat-card>
    } @else {
      <div class="spinner-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    }
  `,
  styles: [`
    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .detail-item strong {
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      width: fit-content;
    }
    .status-badge.active {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .status-badge.inactive {
      background-color: #fbe9e7;
      color: #c62828;
    }
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    mat-card-actions {
      padding: 16px !important;
    }
  `]
})
export class EmployeeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(EmployeeStoreService);
  private readonly dialog = inject(MatDialog);

  employee = signal<Employee | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const emp = this.store.getEmployeeById(id);
      if (emp) {
        this.employee.set(emp);
      } else {
        this.store.loadEmployees().then(() => {
          const loaded = this.store.getEmployeeById(id);
          if (loaded) {
            this.employee.set(loaded);
          } else {
            this.router.navigate(['/employees']);
          }
        });
      }
    }
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && this.employee()) {
        this.store.deleteEmployee(this.employee()!.id).then(success => {
          if (success) {
            this.router.navigate(['/employees']);
          }
        });
      }
    });
  }
}
