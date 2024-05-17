export default class FileInfo {
  uid!: string;
  metaObjectKindUid!: string;
  metaObjectUid!: string;
  fileName!: string;
  mimeType!: string;
  isImage!: boolean;
  isMainImage!: boolean;
  uploadDate!: Date;
  base64String!: string;
}
