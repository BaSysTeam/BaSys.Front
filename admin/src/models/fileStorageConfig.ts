export default class FileStorageConfig {
  uid!: string;
  storageKind!: number;
  s3ConnectionString!: string;
  maxFileSizeMb!: number;
  isEnabled!: boolean;
}
