import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
})
export class SearchInput {
  outputValue = output<string | null>();
  searchInput = new FormControl('');

  inputValue$ = this.searchInput.valueChanges.pipe(
    startWith(''),
    debounceTime(1000),
    distinctUntilChanged(),
  );

  constructor() {
    this.inputValue$.subscribe((value) => this.outputValue.emit(value));
  }
}
