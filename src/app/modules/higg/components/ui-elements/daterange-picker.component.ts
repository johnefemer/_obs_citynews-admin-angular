import { DaterangePickerService } from './../../services/daterange-picker.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-daterange-picker',
  template: `
<span class="m-subheader__daterange" id="daterangepicker_component">
  <span class="m-subheader__daterange-label">
    <span class="m-subheader__daterange-title"></span>
    <span class="m-subheader__daterange-date m--font-brand" ></span>
  </span>
  <a class="btn btn-sm btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill">
      <i class="la la-angle-down"></i>
  </a>
</span>
  `,
  styles: []
})
export class DaterangePickerComponent implements OnInit {
  @Output() date: EventEmitter<any> = new EventEmitter<any>();
  @Output() range: EventEmitter<any> = new EventEmitter<any>();

  picker: any;

  constructor(private _date: DaterangePickerService, private element: ElementRef) {}

  ngOnInit() {
    // console.log(this.element.nativeElement);

    this.initDaterangePicker();
  }

  initDaterangePicker() {
    const $ = window['jQuery'];
    const moment = window['moment'];

    if ($('#daterangepicker_component').length === 0) {
      return;
    }

    this.picker = $('#daterangepicker_component');
    var start = window['moment']();
    var end = window['moment']();

    this.picker.daterangepicker(
      {
        startDate: start,
        endDate: end,
        opens: 'left',
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment()
              .subtract(1, 'month')
              .startOf('month'),
            moment()
              .subtract(1, 'month')
              .endOf('month')
          ]
        }
      },
      (start, end, label) => {
        this.onChange(start, end, label);
      }
    );

    this.onChange(start, end, '');
  } // initDaterangePicker

  onChange(start, end, label = '') {
    const $ = window['jQuery'];
    const moment = window['moment'];

    // this._date.setStartEnd(start, end);
    // console.log([ start, end ]);

    const startDate = moment(start).format('YYYY-MM-DD');
    const endDate = moment(end).format('YYYY-MM-DD');

    if (startDate === endDate) {
      this.date.emit(startDate);
      this._date.onDateChange(startDate);
    } else {
      this.range.emit([startDate, endDate]);
      this._date.onRangeChange([startDate, endDate]);
    }

    var title = '';
    var range = '';

    if (end - start < 100) {
      title = 'Today:';
      range = start.format('MMM D');
    } else if (label == 'Yesterday') {
      title = 'Yesterday:';
      range = start.format('MMM D');
    } else {
      range = start.format('MMM D') + ' - ' + end.format('MMM D');
    }

    $('span.m-subheader__daterange-date').html(range);
    $('span.m-subheader__daterange-title').html(title);
  }
} // end
