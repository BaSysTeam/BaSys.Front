import DataTable from '@/evalEngine/dataTable';
// import FunctionLibrary from '@/evalEngine/functionLibrary';

describe('DataTable', () => {
  let tableProducts: DataTable;

  beforeEach(() => {
    tableProducts = new DataTable()
      .addColumn({ name: 'period', dataType: 'date' })
      .addColumn({ name: 'product', dataType: 'string' })
      .addColumn({ name: 'quantity', dataType: 'number' })
      .addColumn({ name: 'price', dataType: 'number' })
      .addColumn({ name: 'amount', dataType: 'number' })
      .addRow([new Date('2024-09-01'), 'product_1', 5, 100, 0])
      .addRow([new Date('2024-09-02'), 'product_2', 10, 200])
      .addRow([new Date('2024-09-03'), 'product_3', 1, 1000]);
  });

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
    expect(tableProducts.columns.length).toBe(5);
    expect(tableProducts.rows.length).toBe(3);
  });

  it('Delete column', () => {
    tableProducts.deleteColumn('amount');

    expect(tableProducts.columns.length).toBe(4);
    expect(tableProducts.rows[0].amount).toBe(undefined);
  });

  it('Clear table', () => {
    tableProducts.clear();
    expect(tableProducts.columns.length).toBe(0);
    expect(tableProducts.rows.length).toBe(0);
  });

  it('Filter table', () => {
    tableProducts.filter((row:any) => row.quantity <= 5);

    expect(tableProducts.rows.length).toBe(2);
    expect(tableProducts.rows[0].product).toEqual('product_1');
    expect(tableProducts.rows[1].product).toEqual('product_3');
  });

  it('Sum', () => {
    expect(tableProducts.sum('quantity')).toBe(16);
  });

  it('Sum of non existing column. Throw Error', () => {
    expect(() => {
      tableProducts.sum('wrong');
    }).toThrow();
  });

  it('Max', () => {
    tableProducts.addColumn({
      name: 'status',
      dataType: 'number',
    });
    tableProducts.rows[0].status = -1;
    tableProducts.rows[1].status = 1;

    expect(tableProducts.max('status')).toBe(1);
  });

  it('Max date', () => {
    expect(tableProducts.max('period')).toEqual(new Date('2024-09-03'));
  });

  it('Min', () => {
    tableProducts.addColumn({
      name: 'status',
      dataType: 'number',
    });
    tableProducts.rows[0].status = -1;
    tableProducts.rows[1].status = 1;

    expect(tableProducts.min('status')).toBe(-1);
  });

  it('Min date', () => {
    expect(tableProducts.min('period')).toEqual(new Date('2024-09-01'));
  });

  it('Avg', () => {
    expect(tableProducts.avg('quantity')).toBeCloseTo(5.333333, 6);
  });

  it('Count all rows', () => {
    expect(tableProducts.count()).toEqual(3);
  });

  it('Count(quantity)', () => {
    expect(tableProducts.count('quantity')).toEqual(3);
  });

  it('Count(amount)', () => {
    tableProducts.rows[0].amount = 1;
    expect(tableProducts.count('amount')).toEqual(1);
  });

  it('Calculate amount by processRows method', () => {
    const amountTotal = tableProducts
      // eslint-disable-next-line no-return-assign
      .process((row:any) => row.amount = row.quantity * row.price)
      .sum('amount');

    expect(amountTotal).toBeCloseTo(3500, 6);
  });

  /*
  it('Create table', () => {
    const dataTable = FunctionLibrary.createTable([
      { name: 'product', dataType: 'string' },
      { name: 'quantity', dataType: 'number' },
    ]);

    expect(dataTable.columns.length).toBe(2);
  });
  */
});
