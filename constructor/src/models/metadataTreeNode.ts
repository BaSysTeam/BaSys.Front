export default class MetadataTreeNode {
    key?: string;
    parentKey?: string;
    metadataKindUid?: string;
    metaObjectKindName?:string;
    metadataObjectUid?: string;
    metaObjectName?:string;
    memo?:string;
    label?: string;
    data?: any;
    type?: string;
    icon?: string;
    children?: MetadataTreeNode[];
    style?: any;
    styleClass?: string;
    selectable?: boolean;
    leaf?: boolean;
    loading?: boolean;
    expandedIcon?: string;
    collapsedIcon?: string;
    isStandard?: boolean;
    isGroup?: boolean;
    [key: string]: any;

    constructor(param: any) {
      if (param != null) {
        this.key = param.key;
        this.parentKey = param.parentKey;
        this.metadataKindUid = param.metadataKindUid;
        this.metaObjectKindName = param.metaObjectKindName;
        this.metadataObjectUid = param.metadataObjectUid;
        this.metaObjectName = param.metaObjectName;
        this.memo = param.memo;
        this.label = param.label;
        this.data = param.data;
        this.type = param.type;
        this.icon = param.icon;
        this.children = param.children;
        this.style = param.style;
        this.styleClass = param.styleClass;
        this.selectable = param.selectable;
        this.leaf = param.leaf;
        this.loading = param.loading;
        this.expandedIcon = param.expandedIcon;
        this.collapsedIcon = param.collapsedIcon;
        this.isStandard = param.isStandard;
        this.isGroup = param.isGroup;
      }
    }
}
