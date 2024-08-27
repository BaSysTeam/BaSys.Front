import DataObject from '@/models/dataObject';
import { Guid } from 'guid-typescript';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import DependencyInfo from '../../../shared/src/models/dependencyInfo';
import { DependencyKinds } from '../../../shared/src/enums/dependencyKinds';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';

export default class MetaObjectSettingsExampleBuilder {
  buildSettings(): MetaObjectStorableSettings {
    const settings = new MetaObjectStorableSettings(null);

    this.buildHeader(settings);
    this.buildTableProducts(settings);

    return settings;
  }

  buildDataObject(settings: MetaObjectStorableSettings): DataObject {
    const dataObject = new DataObject(settings);
    dataObject.header.discount_personal = 0.1;
    dataObject.header.discount_common = 0.2;

    const tableProductsSettings = settings.getTableByName('products');
    if (!tableProductsSettings) {
      return dataObject;
    }
    const tableProducts = dataObject.newTable({
      name: 'products',
      uid: tableProductsSettings.uid,
    });
    const firstRow = tableProducts.newRow(
      tableProductsSettings,
      DataTypeDefaults.allTypes(),
      '1',
      -1,
    );

    firstRow.product = 1;
    firstRow.quantity = 5;
    firstRow.price = 100;

    const secondRow = tableProducts.newRow(
      tableProductsSettings,
      DataTypeDefaults.allTypes(),
      '1',
      -1,
    );
    secondRow.product = 2;
    secondRow.quantity = 10;
    secondRow.price = 200;

    const thirdRow = tableProducts.newRow(
      tableProductsSettings,
      DataTypeDefaults.allTypes(),
      '1',
      -1,
    );
    thirdRow.product = 3;
    thirdRow.quantity = 1;
    thirdRow.price = 300;

    return dataObject;
  }

  private buildHeader(settings: MetaObjectStorableSettings):void {
    const discountColumn = new MetaObjectTableColumn(
      {
        name: 'discount',
        dataTypeUid: DataTypeDefaults.Decimal.uid,
        formula: '$h.discount_personal + $h.discount_common',
      },
    );
    settings.header.columns.push(discountColumn);

    const discountPersonalColumn = new MetaObjectTableColumn(
      {
        name: 'discount_personal',
        dataTypeUid: DataTypeDefaults.Decimal.uid,
      },
    );
    discountPersonalColumn.dependencies.push(
      new DependencyInfo({
        kind: DependencyKinds.HeaderField,
        fieldUid: discountColumn.uid,
      }),
    );
    settings.header.columns.push(discountPersonalColumn);

    const discountCommonColumn = new MetaObjectTableColumn(
      {
        name: 'discount_common',
        dataTypeUid: DataTypeDefaults.Decimal.uid,
      },
    );
    discountCommonColumn.dependencies.push(new DependencyInfo({
      kind: DependencyKinds.HeaderField,
      fieldUid: discountColumn.uid,
    }));
    settings.header.columns.push(discountCommonColumn);

    settings.header.newColumn({
      name: 'quantity_total',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
      formula: '$t.products.sum("quantity")',
    });
  }

  private buildTableProducts(settings: MetaObjectStorableSettings): void {
    const tableProducts = new MetaObjectTable({
      name: 'products',
      uid: Guid.create().toString(),
    });

    const amountFinalColumn = tableProducts.newColumn({
      name: 'amount_final',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
      formula: '$r.amount - $r.discount_amount',
    });

    const discountAmountColumn = tableProducts.newColumn({
      name: 'discount_amount',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
      formula: '$h.discount * $r.amount',
    });
    discountAmountColumn.dependencies.push(
      new DependencyInfo(
        {
          kind: DependencyKinds.RowField,
          fieldUid: amountFinalColumn.uid,
          tableUid: tableProducts.uid,
        },
      ),
    );

    const discountHeaderColumn = settings.header.getColumnByName('discount');
    if (discountHeaderColumn) {
      discountHeaderColumn.dependencies.push(
        new DependencyInfo(
          {
            kind: DependencyKinds.RowField,
            fieldUid: discountAmountColumn.uid,
            tableUid: tableProducts.uid,
          },
        ),
      );
    }

    const amountColumn = tableProducts.newColumn({
      name: 'amount',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
      formula: '$r.quantity * $r.price',
    });
    amountColumn.dependencies.push(new DependencyInfo(
      {
        kind: DependencyKinds.RowField,
        fieldUid: amountFinalColumn.uid,
        tableUid: tableProducts.uid,
      },
    ));
    amountColumn.dependencies.push(new DependencyInfo(
      {
        kind: DependencyKinds.RowField,
        fieldUid: discountAmountColumn.uid,
        tableUid: tableProducts.uid,
      },
    ));

    tableProducts.newColumn({
      name: 'product',
      dataTypeUid: DataTypeDefaults.Int.uid,
    });
    const quantityColumn = tableProducts.newColumn({
      name: 'quantity',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
    });
    quantityColumn.dependencies.push(new DependencyInfo(
      {
        kind: DependencyKinds.RowField,
        fieldUid: amountColumn.uid,
        tableUid: tableProducts.uid,
      },
    ));
    const quantityTotalHeaderColumn = settings.header.getColumnByName('quantity_total');
    if (quantityTotalHeaderColumn) {
      quantityColumn.dependencies.push(new DependencyInfo(
        {
          kind: DependencyKinds.HeaderField,
          fieldUid: quantityTotalHeaderColumn.uid,
          tableUid: settings.header.uid,
        },
      ));
    }

    const priceColumn = tableProducts.newColumn({
      name: 'price',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
    });
    priceColumn.dependencies.push(new DependencyInfo(
      {
        kind: DependencyKinds.RowField,
        fieldUid: amountColumn.uid,
        tableUid: tableProducts.uid,
      },
    ));

    settings.detailTables.push(tableProducts);
  }
}
