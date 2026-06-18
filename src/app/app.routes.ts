import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'employees',
    loadChildren: () =>
      import('./features/employees/employee.routes').then(m => m.EMPLOYEE_ROUTES)
  },
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: '**', redirectTo: 'employees' }
];
