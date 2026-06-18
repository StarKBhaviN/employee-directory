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
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
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
        this.store.loadEmployees().subscribe(() => {
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
        this.store.deleteEmployee(this.employee()!.id).subscribe(success => {
          if (success) {
            this.router.navigate(['/employees']);
          }
        });
      }
    });
  }
}
