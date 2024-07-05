import ControlKind from '../models/controlKind';
import DataTypeDefaults from './dataTypeDefaults';

export default class ControlKindDefaults {
  static readonly PrimeVueTextInput = new ControlKind({
    uid: '0923119C-04F8-4CE4-A417-777D93011312',
    name: 'PrimeVue.TextInput',
    title: 'Text input',
    appliesFor: [DataTypeDefaults.String],
  });

  static readonly PrimeVueTextArea = new ControlKind({
    uid: '980985DD-60AC-43B7-A5DA-2AF54D6FD1CE',
    name: 'PrimeVue.TextArea',
    title: 'Text area',
    appliesFor: [DataTypeDefaults.String],
  });

  static readonly PrimeVueIntegerInput = new ControlKind({
    uid: '95BE8B41-74E5-4DB9-9A6D-648437F39F70',
    name: 'PrimeVue.IntegerInput',
    title: 'Integer input',
    appliesFor: [DataTypeDefaults.Int, DataTypeDefaults.Long],
  });

  static readonly PrimeVueNumberInput = new ControlKind({
    uid: 'E0776FA7-8462-494D-8275-D9F9D19DC9EC',
    name: 'PrimeVue.NumberInput',
    title: 'Number input',
    appliesFor: [DataTypeDefaults.Decimal],
  });

  static readonly PrimeVueCheckbox = new ControlKind({
    uid: '50989636-3940-461A-89DB-5DE709B58F31',
    name: 'PrimeVue.Checkbox',
    title: 'Checkbox',
    appliesFor: [DataTypeDefaults.Bool],
  });

  static readonly PrimeVueSwitchInput = new ControlKind({
    uid: '80EA55AF-19FE-48E6-8F53-5091DA45C6B7',
    name: 'PrimeVue.SwitchInput',
    title: 'Switch',
    appliesFor: [DataTypeDefaults.Bool],
  });

  static readonly PrimeVueDateInput = new ControlKind({
    uid: '909ADF77-0B49-4A32-8A24-9E29429A2D90',
    name: 'PrimeVue.DateInput',
    title: 'Date input',
    appliesFor: [DataTypeDefaults.DateTime],
  });

  static readonly PrimeVueDateTimeInput = new ControlKind({
    uid: 'EE2CAC4F-0749-4131-93F8-71BD5BE399E6',
    name: 'PrimeVue.DateTimeInput',
    title: 'Date&time input',
    appliesFor: [DataTypeDefaults.DateTime],
  });
}
