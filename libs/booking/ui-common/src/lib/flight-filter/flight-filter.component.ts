import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightFilter } from '@nx-example/booking/domain';

@Component({
  selector: 'flight-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './flight-filter.component.html',
  styleUrls: ['./flight-filter.component.css'],
})
export class FlightFilterComponent {
  @Input() set filter(filter: FlightFilter) {
    this.filterForm.setValue(filter);
  }

  @Output() searchTrigger = new EventEmitter<FlightFilter>();

  filterForm = this.fb.nonNullable.group({
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
    urgent: [false]
  });

  constructor(private fb: FormBuilder) {
  }

  search(): void {
    this.searchTrigger.next(this.filterForm.getRawValue());
  }
}
