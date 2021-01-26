import { SimpleChanges } from '@angular/core';
import { Injectable, OnChanges } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class DaterangePickerService {
  private datePickerSubject = new Subject<string>();
  private dateRangePickerSubject = new Subject<[string]>();

  datePicker = this.datePickerSubject.asObservable();
  dateRangePicker = this.dateRangePickerSubject.asObservable();

  constructor() {}

  onDateChange(start) {
    this.datePickerSubject.next(start);
  }

  onRangeChange(range) {
    this.dateRangePickerSubject.next(range);
  }
} // end
