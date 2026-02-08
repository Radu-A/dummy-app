import { Component } from '@angular/core';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-loading-modal',
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './loading-modal.html',
  styleUrl: './loading-modal.scss',
})
export class LoadingModal {}
