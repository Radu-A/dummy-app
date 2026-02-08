import { Component, inject, input, model } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { ParametersModel } from '../../models/product.model';

import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-toggle-button',
  imports: [MatButtonModule],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss',
})
export class ToggleButton {
  private readonly storageService = inject(StorageService);

  // Two-way binding with his parent
  // ("isGrid" in product-list)
  isTrue = model.required<boolean>();

  // Type of view what you want when "true"
  labelTrue = input.required();
  // Type of view what you want when "false"
  labelFalse = input.required();

  parameters = input.required<ParametersModel>();

  toggleValue() {
    // Invert value
    this.isTrue.set(!this.isTrue());
    // Refresh values in local storage
    const parameters = {
      pageSize: this.parameters().pageSize,
      pageIndex: this.parameters().pageIndex,
      inputValue: this.parameters().inputValue,
      isGrid: this.isTrue(),
    };
    this.storageService.setItem('dummyParams', parameters);
  }
}
