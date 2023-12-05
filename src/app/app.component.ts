import { CommonModule, DOCUMENT, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { IFields, ITimes } from '../assets/types/times.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Pointage';

  fields: IFields = {
    start: {
      label: 'Début',
      hint: '',
      time: null,
    },
    noon: {
      label: 'Pause midi',
      hint: '',
      time: null,
    },
    afternoon: {
      label: 'Reprise',
      hint: '',
      time: null,
    },
    end: {
      label: 'Fin',
      hint: '',
      time: null,
    },
  };

  tempFields: ITimes[] = Object.values(this.fields);

  localStorage: Storage | undefined;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage;

    if (this.localStorage) {
      this.retrieveLocalStorage();
    }
  }

  addTime(): void {
    if (this.fields.start.time === null) {
      this.fields.start.time = new Date();
      this.tempFields = Object.values(this.fields);
    } else if (this.fields.noon.time === null) {
      this.fields.noon.time = new Date();
      this.fields.noon.hint = `${this.spentAndLeftTime(
        this.fields.noon.time,
        this.fields.start.time
      )}`;
      this.tempFields = Object.values(this.fields);
    } else if (this.fields.afternoon.time === null) {
      this.fields.afternoon.time = new Date();
      this.fields.afternoon.hint = `${this.finishTime(
        this.fields.noon.time,
        this.fields.start.time,
        this.fields.afternoon.time
      )}`;
      this.tempFields = Object.values(this.fields);
    } else if (this.fields.end.time === null) {
      this.fields.end.time = new Date();
      this.tempFields = Object.values(this.fields);
    }

    this.sendToLocalStorage(this.fields);
  }

  sendToLocalStorage(fields: IFields): void {
    if (!this.localStorage) return;
    this.localStorage.setItem('fields', JSON.stringify(fields));
  }

  retrieveLocalStorage(): void {
    if (!this.localStorage) return;
    const storedFields = this.localStorage.getItem('fields');
    if (storedFields === null) return;

    const fields = JSON.parse(storedFields);
    if (fields.start.time !== null) {
      this.fields = fields;
      this.tempFields = Object.values(this.fields);
    }
  }
  spentAndLeftTime(end: Date, start: Date): string {
    const spentTimeInMinute = (end.getTime() - start.getTime()) / 1000 / 60;
    const spentHours = Math.floor(spentTimeInMinute / 60);
    const spentMinutes = Math.floor(spentTimeInMinute % 60);
    const leftTimeInHours = Math.floor((470 - spentTimeInMinute) / 60);
    const leftTimeInMinutes = Math.ceil((470 - spentTimeInMinute) % 60);
    return `Écoulé ${spentHours}h${spentMinutes}m, reste ${leftTimeInHours}h${leftTimeInMinutes}m`;
  }

  finishTime(noon: Date, start: Date, afternoon: Date): string {
    const spentTimeInMinute = (noon.getTime() - start.getTime()) / 1000 / 60;
    const leftTimeInMinute = 470 - spentTimeInMinute;
    return `Fin estimée pour ${formatDate(
      new Date(afternoon.getTime() + leftTimeInMinute * 60 * 1000),
      'shortTime',
      'en-US'
    )}`;
  }

  clearTimes(): void {
    this.localStorage?.clear();
    this.fields = {
      start: {
        label: 'Début',
        hint: '',
        time: null,
      },
      noon: {
        label: 'Pause midi',
        hint: '',
        time: null,
      },
      afternoon: {
        label: 'Reprise',
        hint: '',
        time: null,
      },
      end: {
        label: 'Fin',
        hint: '',
        time: null,
      },
    };
    this.tempFields = Object.values(this.fields);
  }
}
