import MetaObjectStorableSettings from '../../../shared/src/models/metaObjectStorableSettings';
import DependencyInfo from '../../../shared/src/models/dependencyInfo';
import { DependencyKinds } from '../../../shared/src/enums/dependencyKinds';
import MetaObjectTableColumn from '../../../shared/src/models/metaObjectTableColumn';
import DataTypeDefaults from '../../../shared/src/dataProviders/dataTypeDefaults';

export default class MetaObjectSettingsExampleBuilder {
  build(): MetaObjectStorableSettings {
    const settings = new MetaObjectStorableSettings(null);

    this.buildHeader(settings);

    return settings;
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
}
