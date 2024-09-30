import FunctionLibrary from '@/evalEngine/functionLibrary';

describe('FunctionLibrary.isEmpty', () => {
  it('Zero value. Returns true', () => {
    expect(FunctionLibrary.isEmpty(0)).toEqual(true);
  });
});

describe('FunctionLibrary.iif', () => {
  it('Condition is true. Return first value', () => {
    const amount = 1;
    expect(FunctionLibrary.iif(amount > 0, 1, 2)).toEqual(1);
  });
  it('Condition is false. Return second value', () => {
    const amount = -1;
    expect(FunctionLibrary.iif(amount > 0, 1, 2)).toEqual(2);
  });
});

describe('FunctionLibrary.ifs', () => {
  it('Condition is true. Return first value', () => {
    // eslint-disable-next-line prefer-const
    let taxId = 1;
    expect(FunctionLibrary.ifs(taxId === 1, 10, taxId === 2, 20, true, 0)).toEqual(10);
  });
  it('Condition is false. Return first value', () => {
    // eslint-disable-next-line prefer-const
    let taxId = 2;
    expect(FunctionLibrary.ifs(taxId === 1, 10, taxId === 2, 20, true, 0)).toEqual(20);
  });
  it('All conditions are false. Return default value', () => {
    // eslint-disable-next-line prefer-const
    let taxId = 3;
    expect(FunctionLibrary.ifs(taxId === 1, 10, taxId === 2, 20, true, 0)).toEqual(0);
  });
  it('All conditions are false. No default value. Return null', () => {
    // eslint-disable-next-line prefer-const
    let taxId = 3;
    expect(FunctionLibrary.ifs(taxId === 1, 10, taxId === 2, 20)).toEqual(null);
  });
});
