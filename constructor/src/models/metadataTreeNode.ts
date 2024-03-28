export default class MetadataTreeNode {
    key?: string;
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
    [key: string]: any;
}
