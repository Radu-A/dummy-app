import { Component, input, output, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-toggle-button',
  imports: [MatButtonModule],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss',
})
export class ToggleButton {
  outputValue = output<boolean>();
  isTrue = signal(true);
  valueA = input.required();
  valueB = input.required();

  toggleValue() {
    this.isTrue.set(!this.isTrue());
    this.outputValue.emit(this.isTrue());
  }
}
