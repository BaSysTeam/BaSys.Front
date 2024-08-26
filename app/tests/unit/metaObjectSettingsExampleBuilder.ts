import DataObject from '@/models/dataObject';
import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import DependencyInfo from '../../../shared/src/models/dependencyInfo';
import { DependencyKinds } from '../../../shared/src/enums/dependencyKinds';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';
import MetaObjectTable from '../../../shared/src/models/metaObjectTable';
import DataType from '../../../shared/src/models/dataType';

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
    const tableProducts = dataObject.tables.products;
    const firstRow = tableProducts.newRow(tableProductsSettings, DataTypeDefaults.allTypes(), '1', -1);

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
  }

  private buildTableProducts(settings: MetaObjectStorableSettings): void {
    const tableProducts = new MetaObjectTable({
      name: 'products',
    });

    tableProducts.newColumn({
      name: 'product',
      dataTypeUid: DataTypeDefaults.Int.uid,
    });
    const quantityColumn = tableProducts.newColumn({
      name: 'quantity',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
    });
    const priceColumn = tableProducts.newColumn({
      name: 'price',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
    });
    const amountColumn = tableProducts.newColumn({
      name: 'amount',
      dataTypeUid: DataTypeDefaults.Decimal.uid,
      formula: '$r.quantity * $r.price',
    });

    amountColumn.dependencies.push(new DependencyInfo(
      {
        kind: DependencyKinds.RowField,
        fieldUid: quantityColumn.uid,
        tableUid: tableProducts.uid,
      },
    ));
    amountColumn.dependencies.push(new DependencyInfo(
      {
        kind: DependencyKinds.RowField,
        fieldUid: priceColumn.uid,
        tableUid: tableProducts.uid,
      },
    ));

    settings.detailTables.push(tableProducts);
  }
}
