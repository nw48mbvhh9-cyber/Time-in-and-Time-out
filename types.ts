export type LocationType = 'Office' | 'Client';

export interface TimeState {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

export interface EntryData {
  date: Date;
  location: LocationType;
  time: TimeState;
}

export enum WorkDayMode {
  TODAY = 'Today',
  YESTERDAY = 'Yesterday',
}