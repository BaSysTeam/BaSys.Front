import ExpressionHelper from '@/evalEngine/expressionHelper';

describe.each([
  ['', ''],
  ['1+2', 'return 1+2'],
  ['1+2;', 'return 1+2;'],
  ['return 1+2', 'return 1+2'],
  ['let c = 1;c+1', 'let c = 1;return c+1'],
  ['let c = 1;c+1;', 'let c = 1;return c+1;'],
  ['let c = 1;\nc+1;', 'let c = 1;\nreturn c+1;'],
  ['createTable().addColumn()\n.addRow();', 'return createTable().addColumn()\n.addRow();'],
])('Add return to expression', (expression, expected) => {
  // Write each test case using 'it'
  it(`Add return to expression ${expression} to equal ${expected}`, () => {
    expect(ExpressionHelper.addReturnStatement(expression)).toBe(expected);
  });
});
