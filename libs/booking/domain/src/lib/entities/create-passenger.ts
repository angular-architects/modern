import { Passenger } from './passenger';

let id = 1;
const defaultPassenger: Passenger = {
  id: 1,
  firstName: 'Anna',
  name: 'Maier',
  bonusMiles: 768,
  passengerStatus: 'B',
};

export function createPassenger(passenger: Partial<Passenger> = {}) {
  return { ...defaultPassenger, id: id++, ...passenger };
}
