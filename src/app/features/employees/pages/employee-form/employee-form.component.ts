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
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEditMode() ? 'Edit Employee' : 'Add Employee' }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullName" placeholder="Enter full name">
            @if (form.get('fullName')?.hasError('required') && form.get('fullName')?.touched) {
              <mat-error>Full Name is required</mat-error>
            }
            @if (form.get('fullName')?.hasError('minlength') && form.get('fullName')?.touched) {
              <mat-error>Minimum 3 characters required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Enter email" type="email">
            @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
              <mat-error>Email is required</mat-error>
            }
            @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
              <mat-error>Enter a valid email</mat-error>
            }
            @if (form.get('email')?.hasError('forbiddenDomain') && form.get('email')?.touched) {
              <mat-error>Emails from test.com are not allowed</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Department</mat-label>
            <input matInput formControlName="department" placeholder="Enter department">
            @if (form.get('department')?.hasError('required') && form.get('department')?.touched) {
              <mat-error>Department is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="Active">Active</mat-option>
              <mat-option value="Inactive">Inactive</mat-option>
            </mat-select>
            @if (form.get('status')?.hasError('required') && form.get('status')?.touched) {
              <mat-error>Status is required</mat-error>
            }
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/employees">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              {{ isEditMode() ? 'Update' : 'Add' }} Employee
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
  `]
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
        this.store.loadEmployees().then(() => {
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

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const formValue = this.form.value as { fullName: string; email: string; department: string; status: 'Active' | 'Inactive' };

    let success: boolean;
    if (this.isEditMode()) {
      success = await this.store.updateEmployee({
        id: this.employeeId,
        ...formValue
      });
    } else {
      success = await this.store.addEmployee(formValue);
    }

    if (success) {
      this.router.navigate(['/employees']);
    }
  }
}
