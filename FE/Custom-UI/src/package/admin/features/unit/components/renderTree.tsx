import { UnitDTO } from "@models/unitDto";
import { Tag } from "antd";

export const renderTree = (nodes: UnitDTO[]): any => {
  return nodes.map((node) => {
    const nodeData = {
      title: <Tag> {node.unitName}</Tag>,
      id: node.id,
      value: node.id,
      key: node.id,
      unitName: node.unitName,
      unitCode: node.unitCode,
      parentId: node.parentId,
      status: node.status,
      createdBy: node.createdBy,
      createdDate: node.createdDate,
      isHide: node.isHide
    };

    if (node.children && node.children.length > 0) {
      return {
        ...nodeData,
        children: renderTree(node.children)
      };
    }

    return nodeData;
  });
};
