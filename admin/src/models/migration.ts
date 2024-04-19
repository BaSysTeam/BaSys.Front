export default class Migration {
  uid!: string;
  name!: string;
  description!: string;
  migrationUtcIdentifier: Date = new Date();
  isApplied!: boolean;
  isPossibleRemove!: boolean;
}
