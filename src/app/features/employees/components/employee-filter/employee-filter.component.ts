import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-filter',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  template: `
    <div class="filter-container">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search by name</mat-label>
        <input matInput
               [ngModel]="searchTerm()"
               (ngModelChange)="searchChange.emit($event)"
               placeholder="Type employee name...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline" class="status-field">
        <mat-label>Status</mat-label>
        <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilterChange.emit($event)">
          <mat-option value="All">All</mat-option>
          <mat-option value="Active">Active</mat-option>
          <mat-option value="Inactive">Inactive</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="sort-field">
        <mat-label>Sort by Name</mat-label>
        <mat-select [ngModel]="sortDirection()" (ngModelChange)="sortChange.emit($event)">
          <mat-option value="asc">A-Z</mat-option>
          <mat-option value="desc">Z-A</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .filter-container {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .search-field {
      flex: 1;
      min-width: 200px;
    }
    .status-field, .sort-field {
      width: 150px;
    }
    @media (max-width: 600px) {
      .status-field, .sort-field {
        width: 100%;
      }
    }
  `]
})
export class EmployeeFilterComponent {
  searchTerm = input<string>('');
  statusFilter = input<string>('All');
  sortDirection = input<'asc' | 'desc'>('asc');

  searchChange = output<string>();
  statusFilterChange = output<string>();
  sortChange = output<'asc' | 'desc'>();
}
