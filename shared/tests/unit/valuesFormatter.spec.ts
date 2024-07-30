import ValuesFormatter from '@/helpers/valuesFormatter';

describe('formatNumber', () => {
  it('formatNumber null returns empty string', () => {
    const result = ValuesFormatter.formatNumber(null, 2);
    expect(result).toEqual('');
  });

  it('number with 2 digits and groups formats correctly', () => {
    const result = ValuesFormatter.formatNumber(1234.567, 2);
    expect(result).toEqual('1 234.57');
  });

  it('number with 3 digits and groups formats correctly', () => {
    const result = ValuesFormatter.formatNumber(1000, 3);
    expect(result).toEqual('1 000.000');
  });

  it('integer formats correctly', () => {
    const result = ValuesFormatter.formatNumber(10, 0);
    expect(result).toEqual('10');
  });

  it('not number returns toString', () => {
    const result = ValuesFormatter.formatNumber({ name: 'currency', title: 'Currency' }, 3);
    expect(result).toEqual('[object Object]');
  });
});

describe('formatDate', () => {
  it('null returns empty string', () => {
    const result = ValuesFormatter.formatDate(null);
    expect(result).toEqual('');
  });

  it('formatDate returns date string', () => {
    const testDate = new Date(
      2024,
      6, // Month is zero-based.
      30,
      13,
      32,
      45,
    );
    const result = ValuesFormatter.formatDate(testDate);
    expect(result).toEqual('30.07.2024');
  });

  it('ISO string input returns date string', () => {
    const input = '2024-07-26T00:00:00';
    const result = ValuesFormatter.formatDate(input);
    expect(result).toEqual('26.07.2024');
  });

  it('string input returns string', () => {
    const input = 'just string';
    const result = ValuesFormatter.formatDate(input);
    expect(result).toEqual(input);
  });
});

describe('formatDataTime', () => {
  it('null returns empty string', () => {
    const result = ValuesFormatter.formatDateTime(null);
    expect(result).toEqual('');
  });

  it('formatDateTime returns date time string', () => {
    const testDate = new Date(
      2024,
      6, // Month is zero-based.
      30,
      13,
      32,
      45,
    );
    const result = ValuesFormatter.formatDateTime(testDate);
    expect(result).toEqual('30.07.2024 13:32:45');
  });

  it('ISO string returns date time string', () => {
    const input = '2024-07-26T14:52:13';
    const result = ValuesFormatter.formatDateTime(input);
    expect(result).toEqual('26.07.2024 14:52:13');
  });

  it('string returns string', () => {
    const input = 'just string';
    const result = ValuesFormatter.formatDateTime(input);
    expect(result).toEqual(input);
  });
});
