export default class FunctionLibrary {
  static isEmpty(value: any): boolean {
    if (value) {
      return false;
    }
    return true;
  }

  static isNotEmpty(value: any): boolean {
    return !FunctionLibrary.isEmpty(value);
  }
}
