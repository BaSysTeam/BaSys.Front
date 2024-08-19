import FunctionLibrary from '@/evalEngine/functionLibrary';

describe('FunctionLibrary.isEmpty', () => {
  it('Zero value. Returns true', () => {
    expect(FunctionLibrary.isEmpty(0)).toEqual(true);
  });
});
