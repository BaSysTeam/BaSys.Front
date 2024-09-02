import '../../src/evalEngine/dateExtensions';

describe('dateExtensions', () => {
  it('beginDay', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.beginDay()).toEqual(new Date('2024-09-02T00:00:00'));
  });

  it('endDay', () => {
    const date = new Date('2024-09-02T11:32:45');
    expect(date.endDay()).toEqual(new Date('2024-09-02T23:59:59'));
  });
});
