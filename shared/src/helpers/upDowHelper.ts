export default class UpDownHelper {
  static up(collection: any[], item: any): void {
    const ind = collection.indexOf(item);
    const i = ind - 1;
    if (i < 0) {
      return;
    }

    const temp = collection[i];
    collection[i] = item;
    collection[ind] = temp;
  }

  static down(collection: any[], item: any): void {
    const ind = collection.indexOf(item);
    const i = ind + 1;
    if (i >= collection.length) {
      return;
    }

    const temp = collection[i];
    collection[i] = item;
    collection[ind] = temp;
  }
}
