import ControlKind from '../models/controlKind';
import DataTypeDefaults from './dataTypeDefaults';

export default class ControlKindDefaults {
  static readonly PrimeVueTextInput = new ControlKind({
    uid: '0923119c-04f8-4ce4-a417-777d93011312',
    name: 'PrimeVue.TextInput',
    title: 'Text input',
    appliesFor: [DataTypeDefaults.String],
  });

  static readonly PrimeVueTextArea = new ControlKind({
    uid: '980985dd-60ac-43b7-a5da-2af54d6fd1ce',
    name: 'PrimeVue.TextArea',
    title: 'Text area',
    appliesFor: [DataTypeDefaults.String],
  });

  static readonly PrimeVueIntegerInput = new ControlKind({
    uid: '95be8b41-74e5-4db9-9a6d-648437f39f70',
    name: 'PrimeVue.IntegerInput',
    title: 'Integer input',
    appliesFor: [DataTypeDefaults.Int, DataTypeDefaults.Long],
  });

  static readonly PrimeVueNumberInput = new ControlKind({
    uid: 'e0776fa7-8462-494d-8275-d9f9d19dc9ec',
    name: 'PrimeVue.NumberInput',
    title: 'Number input',
    appliesFor: [DataTypeDefaults.Decimal],
  });

  static readonly PrimeVueCheckbox = new ControlKind({
    uid: '50989636-3940-461a-89db-5de709b58f31',
    name: 'PrimeVue.Checkbox',
    title: 'Checkbox',
    appliesFor: [DataTypeDefaults.Bool],
  });

  static readonly PrimeVueSwitchInput = new ControlKind({
    uid: '80ea55af-19fe-48e6-8f53-5091da45c6b7',
    name: 'PrimeVue.SwitchInput',
    title: 'Switch',
    appliesFor: [DataTypeDefaults.Bool],
  });

  static readonly PrimeVueDateInput = new ControlKind({
    uid: '909adf77-0b49-4a32-8a24-9e29429a2d90',
    name: 'PrimeVue.DateInput',
    title: 'Date input',
    appliesFor: [DataTypeDefaults.DateTime],
  });

  static readonly PrimeVueDateTimeInput = new ControlKind({
    uid: 'ee2cac4f-0749-4131-93f8-71bd5be399e6',
    name: 'PrimeVue.DateTimeInput',
    title: 'Date&time input',
    appliesFor: [DataTypeDefaults.DateTime],
  });

  public static AllItems(): ControlKind[] {
    return [this.PrimeVueTextInput,
      this.PrimeVueTextArea,
      this.PrimeVueIntegerInput,
      this.PrimeVueNumberInput,
      this.PrimeVueCheckbox,
      this.PrimeVueSwitchInput,
      this.PrimeVueDateInput,
      this.PrimeVueDateTimeInput];
  }
}
