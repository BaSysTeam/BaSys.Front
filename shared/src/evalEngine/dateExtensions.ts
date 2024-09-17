/* eslint-disable no-extend-native */

interface Date{
  beginDay(): Date;
  endDay(): Date;
  beginMonth(): Date;
  endMonth(): Date;
  beginQuarter():Date;
  endQuarter():Date;
  beginYear(): Date;
  endYear(): Date;
}

Date.prototype.beginDay = function beginDay(): Date {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

Date.prototype.endDay = function endDay(): Date {
  return new Date(
    this.getFullYear(),
    this.getMonth(),
    this.getDate(),
    23,
    59,
    59,
    999,
  );
};

Date.prototype.beginMonth = function beginMonth():Date {
  return new Date(this.getFullYear(), this.getMonth(), 1);
};

Date.prototype.endMonth = function endMonth(): Date {
  return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).endDay();
};

Date.prototype.beginQuarter = function beginQuarter():Date {
  let month: number;
  switch (this.getMonth()) {
    case 0:
    case 1:
    case 2:
      month = 0;
      break;
    case 3:
    case 4:
    case 5:
      month = 3;
      break;
    case 6:
    case 7:
    case 8:
      month = 6;
      break;
    case 9:
    case 10:
    case 11:
      month = 9;
      break;
    default:
      month = 0;
  }

  return new Date(this.getFullYear(), month, 1, 0, 0, 0);
};

Date.prototype.endQuarter = function endQuarter():Date {
  let month: number;
  switch (this.getMonth()) {
    case 0:
    case 1:
    case 2:
      month = 2;
      break;
    case 3:
    case 4:
    case 5:
      month = 5;
      break;
    case 6:
    case 7:
    case 8:
      month = 8;
      break;
    case 9:
    case 10:
    case 11:
      month = 11;
      break;
    default:
      month = 2;
  }

  return (new Date(this.getFullYear(), month, 1)).endMonth();
};
