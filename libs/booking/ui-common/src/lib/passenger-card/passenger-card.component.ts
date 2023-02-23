import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Passenger } from '@nx-example/booking/domain';
import { NgIf } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'passenger-card',
  templateUrl: 'passenger-card.component.html',
  styleUrls: ['passenger-card.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class PassengerCardComponent {
  @Input() passenger: Passenger | undefined;
  @Output() downgrade = new EventEmitter();
  @Output() upgrade = new EventEmitter();
}
