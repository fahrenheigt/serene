export interface Session {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  completed: boolean;
  sound: string;
}

export type PickerStyle = 'buttons' | 'slider';

export interface Settings {
  defaultDuration: number;
  defaultSound: string;
  intervalMinutes: number;
  theme: 'light' | 'dark';
  pickerStyle: PickerStyle;
  showDurationPicker: boolean;
  showSoundPicker: boolean;
  breathCycle: number;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultDuration: 10,
  defaultSound: 'silence',
  intervalMinutes: 0,
  theme: 'light',
  pickerStyle: 'buttons',
  showDurationPicker: true,
  showSoundPicker: true,
  breathCycle: 8,
};
