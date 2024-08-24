import DataObjectDetailsTable from '@/models/dataObjectDetailsTable';

describe('DataObjectDetailsTable', () => {
  it('Return sum of column', () => {
    const table = new DataObjectDetailsTable(null);
    table.rows.push({ product: 1, amount: 100 });
    table.rows.push({ product: 1, amount: 200.5 });

    expect(table.sum('amount')).toEqual(300.5);
  });
});
