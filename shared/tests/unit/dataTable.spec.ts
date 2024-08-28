import DataTable from '@/evalEngine/dataTable';

describe('DataTable', () => {
  const tableProducts = (new DataTable())
    .addColumn({ name: 'product', dataType: 'string' })
    .addColumn({ name: 'quantity', dataType: 'number' })
    .addColumn({ name: 'price', dataType: 'number' })
    .addColumn({ name: 'amount', dataType: 'number' })
    .addRow(['product_1', 5, 100, 0])
    .addRow(['product_2', 10, 200])
    .addRow(['product_3', 1, 1000]);

  it('Add column', () => {
    const dataTable = new DataTable();
    dataTable.addColumn({ name: 'product' });

    expect(dataTable.columns.length).toBe(1);
    expect(dataTable.columns[0].name).toEqual('product');
  });

  it('Error if add duplicate column', () => {
    expect(() => {
      const dataTable = new DataTable();
      dataTable.addColumn({ name: 'product' })
        .addColumn({ name: 'product' });
    }).toThrow();
  });

  it('Error if add row to DataTable without columns', () => {
    expect(() => {
      const dataTable = new DataTable();
      dataTable.addRow(['product_1', 5, 100, 0]);
    }).toThrow();
  });

  it('Build dataTable', () => {
    expect(tableProducts.columns.length).toBe(4);
    expect(tableProducts.rows.length).toBe(3);
  });

  it('Delete column', () => {
    tableProducts.deleteColumn('amount');

    expect(tableProducts.columns.length).toBe(3);
    expect(tableProducts.rows[0].amount).toBe(undefined);
  });
});
