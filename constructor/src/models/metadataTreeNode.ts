export default class MetadataTreeNode {
    key?: string;
    parentKey?: string;
    metadataKindUid?: string;
    metaObjectKindName?:string;
    metadataObjectUid?: string;
    metaObjectName?:string;
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
}
