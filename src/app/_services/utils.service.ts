import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class UtilityService {
  onShowConfirm = new EventEmitter<any>();
  onShowConfirmYesNoCancel = new EventEmitter<any>();
  onShowMessage = new EventEmitter<any>();

  onSortColumn = new EventEmitter<any>();
  onSortColumnCompleted = new EventEmitter<any>();

  onFilterColumn = new EventEmitter<any>();

  showConfirm(message: string, callback: Function) {
    this.onShowConfirm.emit({ message, callback });
  }

  showConfirmYesNoCancel(message: string, callback: Function) {
    this.onShowConfirmYesNoCancel.emit({ message, callback });
  }

  showMessage(message: string) {
    this.onShowConfirm.emit({ message });
  }

  getReverseFullname(fullname: string): string {
    let rs = "";
    let s = (fullname || "").split(" ").filter((p) => p);
    if (s && s.length > 0) {
      let firstName = s.pop();
      rs = firstName + " " + s.join(" ");
    }
    return rs;
  }

  setReverseFullname(
    data: any[],
    fieldName: string = "fullname",
    reverseFieldName: string = "reverseFullname"
  ) {
    if (data) {
      data.forEach((e) => {
        e[reverseFieldName] = this.getReverseFullname(e[fieldName]);
      });
    }
  }

  getDateNow() {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const yyyy = date.getFullYear();
    const valueDate = yyyy + "-" + (mm < 10 ? "0" + mm : mm) + "-" + dd;
    return valueDate;
  }

  getDaysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  getWeekDay(date) {
    const weekdays = new Array("CN", "T2", "T3", "T4", "T5", "T6", "T7");
    const day = date.getDay();
    return weekdays[day];
  }

  getDays(date) {
    var result = new Date(date);
    result.setDate(result.getDate());
    const daysInMonth = this.getWeekDay(result);
    return [daysInMonth, result];
  }

  addDays(date, cal, days) {
    if (cal === "+") {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      const daysInMonth = this.getWeekDay(result);
      return [daysInMonth, result];
    } else {
      var result = new Date(date);
      result.setDate(result.getDate() - days);
      const daysInMonth = this.getWeekDay(result);
      return [daysInMonth, result];
    }
  }

  findDaysOfWeek(object, value) {
    return Object.keys(object).filter((key) => object[key] === value);
  }
}
