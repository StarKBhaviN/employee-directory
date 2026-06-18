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
  templateUrl: './employee-filter.component.html',
  styleUrl: './employee-filter.component.scss'
})
export class EmployeeFilterComponent {
  searchTerm = input<string>('');
  statusFilter = input<string>('All');
  sortDirection = input<'asc' | 'desc'>('asc');

  searchChange = output<string>();
  statusFilterChange = output<string>();
  sortChange = output<'asc' | 'desc'>();
}
