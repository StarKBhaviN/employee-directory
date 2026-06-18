import { Component, input, output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss'
})
export class EmployeeTableComponent {
  employees = input.required<Employee[]>();
  deleteRequest = output<Employee>();

  displayedColumns = ['fullName', 'email', 'department', 'status', 'actions'];
}
