import NameHelper from '@/helpers/nameHelper';

describe('nameHelper', () => {
  it('prepareName null value - return empty string', () => {
    const result = NameHelper.prepareName(null, true, 0);
    expect(result).toEqual('');
  });
  it('prepareName latin lower case', () => {
    const result = NameHelper.prepareName('test', true, 0);
    expect(result).toEqual('test');
  });
  it('prepareName latin with uppercase - return lower case name', () => {
    const result = NameHelper.prepareName('Product', true, 0);
    expect(result).toEqual('product');
  });
  it('prepareName latin with uppercase - return lower case name', () => {
    const result = NameHelper.prepareName('Product group', true, 0);
    expect(result).toEqual('product_group');
  });
  it('prepareName latin with uppercase and length limit - return lower case name', () => {
    const result = NameHelper.prepareName('Product group', true, 10);
    expect(result).toEqual('product_gr');
  });
  it('prepareName latin with first number - return lower case name', () => {
    const result = NameHelper.prepareName('21Product', true, 0);
    expect(result).toEqual('product');
  });
  it('prepareName latin with last number - return lower case name', () => {
    const result = NameHelper.prepareName('Product21', true, 0);
    expect(result).toEqual('product21');
  });
  it('prepareName latin with special character - return lower case name', () => {
    const result = NameHelper.prepareName('Product#21', true, 0);
    expect(result).toEqual('product21');
  });
  it('prepareName russian - return transliterate', () => {
    const result = NameHelper.prepareName('Товар', true, 0);
    expect(result).toEqual('tovar');
  });
  it('prepareName russian - return russian lower case', () => {
    const result = NameHelper.prepareName('Товар', false, 0);
    expect(result).toEqual('товар');
  });
});
