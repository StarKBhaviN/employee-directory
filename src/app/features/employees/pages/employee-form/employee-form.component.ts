import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EmployeeStoreService } from '../../../../core/services/employee-store.service';
import { forbiddenEmailDomainValidator } from '../../../../shared/validators/email-domain.validator';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(EmployeeStoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = signal(false);
  private employeeId = '';

  form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, forbiddenEmailDomainValidator('test.com')]],
    department: ['', [Validators.required]],
    status: ['Active', [Validators.required]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.employeeId = id;
      const employee = this.store.getEmployeeById(id);
      if (employee) {
        this.form.patchValue(employee);
      } else {
        // Employee not loaded yet, load then patch
        this.store.loadEmployees().subscribe(() => {
          const emp = this.store.getEmployeeById(id);
          if (emp) {
            this.form.patchValue(emp);
          } else {
            this.router.navigate(['/employees']);
          }
        });
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value as { fullName: string; email: string; department: string; status: 'Active' | 'Inactive' };

    if (this.isEditMode()) {
      this.store.updateEmployee({
        id: this.employeeId,
        ...formValue
      }).subscribe(success => {
        if (success) {
          this.router.navigate(['/employees']);
        }
      });
    } else {
      this.store.addEmployee(formValue).subscribe(success => {
        if (success) {
          this.router.navigate(['/employees']);
        }
      });
    }
  }
}
