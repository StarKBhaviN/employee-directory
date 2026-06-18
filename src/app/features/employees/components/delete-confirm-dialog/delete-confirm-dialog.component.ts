import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this employee?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancel</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close(true)">Delete</button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteConfirmDialogComponent>);
}
