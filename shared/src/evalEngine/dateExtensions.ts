/* eslint-disable no-extend-native */

interface Date{
  beginDay(): Date;
  endDay(): Date;
}

Date.prototype.beginDay = function beginDay(): Date {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

Date.prototype.endDay = function beginDay(): Date {
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
