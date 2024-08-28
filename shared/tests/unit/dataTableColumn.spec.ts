import DataTableColumn from '@/evalEngine/dataTableColumn';

describe('DataTableColumn', () => {
  it('Empty name throw exception', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new DataTableColumn({});
    }).toThrow();
  });

  it('Wrong type throw exception', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new DataTableColumn(
        { name: 'quantity', dataType: 'wrong' },
      );
    }).toThrow();
  });

  it('Default value for string', async () => {
    const newColumn = new DataTableColumn(
      {
        name: 'message',
        dataType: 'string',
      },
    );
    expect(newColumn.defaultValue).toEqual('');
  });

  it('Default value for number', async () => {
    const newColumn = new DataTableColumn(
      {
        name: 'quantity',
        dataType: 'number',
      },
    );
    expect(newColumn.defaultValue).toEqual(0);
  });

  it('Default value for boolean', async () => {
    const newColumn = new DataTableColumn(
      {
        name: 'flag',
        dataType: 'boolean',
      },
    );
    expect(newColumn.defaultValue).toEqual(false);
  });
  it('Default value for date', async () => {
    const newColumn = new DataTableColumn(
      {
        name: 'deadLine',
        dataType: 'date',
      },
    );
    expect(newColumn.defaultValue).toEqual(new Date('1980-01-01'));
  });
});
