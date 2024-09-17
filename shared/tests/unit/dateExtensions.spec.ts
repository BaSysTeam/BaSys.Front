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
});
