import ObjectEvaluator from '@/evalEngine/objectEvaluator';
import MetaObjectSettingsExampleBuilder from './metaObjectSettingsExampleBuilder';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';

describe('ObjectEvaluator', () => {
  it('Recalculate dependencies in header', () => {
    const builder = new MetaObjectSettingsExampleBuilder();
    const settings = builder.buildSettings();
    const dataObject = builder.buildDataObject(settings);

    const logger = new InMemoryLogger(LogLevels.Trace);

    const evaluator = new ObjectEvaluator(logger, settings, dataObject);
    evaluator.onHeaderFieldChanged('discount_personal');

    console.log('Calculation log:');
    logger.messages.forEach((message) => {
      console.log(message.toString());
    });

    expect(dataObject.header.discount).toBeCloseTo(0.3, 6);
  });

  it('Recalculate dependencies in row', () => {
    const builder = new MetaObjectSettingsExampleBuilder();
    const settings = builder.buildSettings();
    const dataObject = builder.buildDataObject(settings);
    dataObject.header.discount = 0.1;

    const tableProducts = dataObject.tables.products;
    const firstRow = tableProducts.rows[0];

    const logger = new InMemoryLogger(LogLevels.Trace);
    const evaluator = new ObjectEvaluator(logger, settings, dataObject);
    evaluator.onRowFieldChanged('price', tableProducts.uid, firstRow);

    expect(firstRow.amount).toBeCloseTo(500, 6);
    expect(firstRow.discount_amount).toBeCloseTo(50, 6);
    expect(firstRow.amount_final).toBeCloseTo(450, 6);
  });

  it('Calculate totals in header', () => {
    const builder = new MetaObjectSettingsExampleBuilder();
    const settings = builder.buildSettings();
    const dataObject = builder.buildDataObject(settings);
    dataObject.header.discount = 0.1;

    const tableProducts = dataObject.tables.products;
    const firstRow = tableProducts.rows[0];

    const logger = new InMemoryLogger(LogLevels.Trace);
    const evaluator = new ObjectEvaluator(logger, settings, dataObject);
    evaluator.onRowFieldChanged('quantity', tableProducts.uid, firstRow);

    expect(dataObject.header.quantity_total).toBeCloseTo(15, 6);
  });
});
