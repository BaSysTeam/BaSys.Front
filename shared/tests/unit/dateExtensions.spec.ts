import '../../src/evalEngine/dateExtensions';

describe('dateExtensions', () => {
  it('beginDay', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.beginDay()).toEqual(new Date('2024-09-02T00:00:00'));
  });

  it('endDay', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.endDay()).toEqual(new Date(2024, 8, 2, 23, 59, 59, 999));
  });

  it('addDays plus 1', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.addDays(1)).toEqual(new Date(2024, 8, 3, 11, 32, 45));
  });

  it('addDays plus 30', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.addDays(30)).toEqual(new Date(2024, 9, 2, 11, 32, 45));
  });

  it('addDays minus 1', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.addDays(-1)).toEqual(new Date(2024, 8, 1, 11, 32, 45));
  });

  it('beginMonth', () => {
    const date = new Date('2024-09-17T11:54:22');
    expect(date.beginMonth()).toEqual(new Date('2024-09-01T00:00:00'));
  });

  it('endMonth 30 days', () => {
    const date = new Date('2024-09-17T11:54:22');
    expect(date.endMonth()).toEqual(new Date(2024, 8, 30, 23, 59, 59, 999));
  });

  it('endMonth 31 days', () => {
    const date = new Date('2024-10-17T11:54:22');
    expect(date.endMonth()).toEqual(new Date(2024, 9, 31, 23, 59, 59, 999));
  });

  it('endMonth 29 days', () => {
    const date = new Date('2024-02-17T11:54:22');
    expect(date.endMonth()).toEqual(new Date(2024, 1, 29, 23, 59, 59, 999));
  });

  it('endMonth 28 days', () => {
    const date = new Date('2023-02-17T11:54:22');
    expect(date.endMonth()).toEqual(new Date(2023, 1, 28, 23, 59, 59, 999));
  });

  it('beginQuarter 1 quarter', () => {
    const date = new Date('2024-02-17T11:54:22');
    expect(date.beginQuarter()).toEqual(new Date(2024, 0, 1));
  });

  it('beginQuarter 2 quarter', () => {
    const date = new Date('2024-05-17T11:54:22');
    expect(date.beginQuarter()).toEqual(new Date(2024, 3, 1));
  });

  it('beginQuarter 3 quarter', () => {
    const date = new Date('2024-09-17T11:54:22');
    expect(date.beginQuarter()).toEqual(new Date(2024, 6, 1));
  });

  it('beginQuarter 4 quarter', () => {
    const date = new Date('2024-11-17T11:54:22');
    expect(date.beginQuarter()).toEqual(new Date(2024, 9, 1));
  });

  it('endQuarter 1 quarter', () => {
    const date = new Date('2024-02-17T11:54:22');
    expect(date.endQuarter()).toEqual(new Date(2024, 2, 31, 23, 59, 59, 999));
  });

  it('endQuarter 2 quarter', () => {
    const date = new Date('2024-05-17T11:54:22');
    expect(date.endQuarter()).toEqual(new Date(2024, 5, 30, 23, 59, 59, 999));
  });

  it('endQuarter 3 quarter', () => {
    const date = new Date('2024-09-17T11:54:22');
    expect(date.endQuarter()).toEqual(new Date(2024, 8, 30, 23, 59, 59, 999));
  });

  it('endQuarter 4 quarter', () => {
    const date = new Date('2024-11-17T11:54:22');
    expect(date.endQuarter()).toEqual(new Date(2024, 11, 31, 23, 59, 59, 999));
  });

  it('beginYear', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.beginYear()).toEqual(new Date(2024, 0, 1));
  });

  it('endYear', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.endYear()).toEqual(new Date(2024, 11, 31, 23, 59, 59, 999));
  });

  it('addYears plus 1', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.addYears(1)).toEqual(new Date(2025, 8, 2, 11, 32, 45, 0));
  });

  it('addYears minus 1', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.addYears(-1)).toEqual(new Date(2023, 8, 2, 11, 32, 45, 0));
  });
});

describe('addMonths', () => {
  test.each([
    ['2024-09-17T14:47:23', 1, '2024-10-17T14:47:23'],
    ['2024-09-17T14:47:23', -1, '2024-08-17T14:47:23'],
  ])('adds to %j  %j months to get %j', (start, shift, expected) => {
    const date = new Date(start);
    expect(date.addMonths(shift)).toEqual(new Date(expected));
  });
});

describe('addQuarters', () => {
  test.each([
    ['2024-09-17T14:47:23', 1, '2024-12-17T14:47:23'],
    ['2024-09-17T14:47:23', -1, '2024-06-17T14:47:23'],
  ])('adds to %j  %j quarters to get %j', (start, shift, expected) => {
    const date = new Date(start);
    expect(date.addQuarters(shift)).toEqual(new Date(expected));
  });
});
