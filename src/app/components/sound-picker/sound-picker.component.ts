import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AmbientSound, AMBIENT_SOUNDS } from '../../services/audio.service';

@Component({
  selector: 'app-sound-picker',
  standalone: true,
  template: `
    <div class="sound-grid">
      @for (s of sounds; track s.id) {
        <button
          class="sound-chip"
          [class.active]="s.id === active"
          (click)="select.emit(s.id)">{{ s.label }}</button>
      }
    </div>
  `,
  styleUrls: ['./sound-picker.component.scss'],
})
export class SoundPickerComponent {
  readonly sounds = AMBIENT_SOUNDS;
  @Input() active: AmbientSound = 'silence';
  @Output() select = new EventEmitter<AmbientSound>();
}
