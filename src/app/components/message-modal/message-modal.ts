import { Component, inject } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-message-modal',
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './message-modal.html',
  styleUrl: './message-modal.scss',
})
export class MessageModal {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
}
