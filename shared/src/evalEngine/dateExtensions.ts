/* eslint-disable no-extend-native */

interface Date{
  beginDay(): Date;
  endDay(): Date;
  beginMonth(): Date;
  endMonth(): Date;
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
