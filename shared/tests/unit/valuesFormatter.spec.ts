import { shallowMount } from '@vue/test-utils';
import ValuesFormatter from '@/helpers/valuesFormatter';

describe('ValuesFormatter', () => {
  it('null returns empty string', () => {
    const result = ValuesFormatter.formatNumber(null, 2);
    expect(result).toEqual('');
  });

  it('number with 2 digits and groups formats correctly', () => {
    const result = ValuesFormatter.formatNumber(1234.567, 2);
    console.log('result', result);
    expect(result).toEqual('1 234.57');
  });

  it('number with 3 digits and groups formats correctly', () => {
    const result = ValuesFormatter.formatNumber(1000, 3);
    console.log('result', result);
    expect(result).toEqual('1 000.000');
  });

  it('integer formats correctly', () => {
    const result = ValuesFormatter.formatNumber(10, 0);
    console.log('result', result);
    expect(result).toEqual('10');
  });

  it('not number returns toString', () => {
    const result = ValuesFormatter.formatNumber({ name: 'currency', title: 'Currency' }, 3);
    console.log('result', result);
    expect(result).toEqual('[object Object]');
  });
});
