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
  theme: string;
  pickerStyle: PickerStyle;
  showDurationPicker: boolean;
  showSoundPicker: boolean;
  breathCycle: number;
  showBreathGuide: boolean;
  userName: string;
}

export const DEFAULT_SETTINGS: Settings = {
  defaultDuration: 10,
  defaultSound: 'silence',
  intervalMinutes: 0,
  theme: 'dark',
  pickerStyle: 'buttons',
  showDurationPicker: true,
  showSoundPicker: true,
  breathCycle: 8,
  showBreathGuide: true,
  userName: '',
};
