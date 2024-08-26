import DataObject from '@/models/dataObject';
import ObjectEvaluator from '@/evalEngine/objectEvaluator';
import MetaObjectSettingsExampleBuilder from './metaObjectSettingsExampleBuilder';
import InMemoryLogger from '../../../shared/src/models/inMemoryLogger';
import { LogLevels } from '../../../shared/src/enums/logLevels';

describe('ObjectEvaluator', () => {
  it('Recalculate dependencies in header', () => {
    console.log('Recalculate dependencies in header');
    const builder = new MetaObjectSettingsExampleBuilder();
    const settings = builder.build();

    const dataObject = new DataObject(settings);
    dataObject.header.discount_personal = 0.1;
    dataObject.header.discount_common = 0.2;

    const logger = new InMemoryLogger(LogLevels.Trace);

    const evaluator = new ObjectEvaluator(logger, settings, dataObject);
    evaluator.onHeaderFieldChanged('discount_personal');

    console.log('Calculation log:');
    logger.messages.forEach((message) => {
      console.log(message.toString());
    });

    expect(dataObject.header.discount).toBeCloseTo(0.3, 6);
  });
});
