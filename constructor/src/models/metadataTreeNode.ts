import { MetadataTreeNodeTypes } from '@/enums/metadataTreeNodeTypes';

export default class MetadataTreeNode {
    key?: string;
    parentKey?: string;
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
    nodeType?: MetadataTreeNodeTypes;
    [key: string]: any;
}
