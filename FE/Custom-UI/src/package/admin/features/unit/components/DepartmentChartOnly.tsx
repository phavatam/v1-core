import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { useGetListUnitByIdParentQuery } from "@API/services/UnitApis.service";
import { Card, Col, Row, Spin, Tree, Typography } from "antd";
import { UnitDTO } from "@models/unitDto";
import { ApartmentOutlined } from "@ant-design/icons";

interface DepartmentChartOnlyProps {
  id?: string;
}

const renderTreeNodes = (nodes: UnitDTO[]) => {
  return nodes.map((node) => {
    if (node.children && node.children.length > 0) {
      return (
        <Tree.TreeNode
          title={<Typography.Text strong>{node.unitName}</Typography.Text>}
          key={node.id}
          icon={<ApartmentOutlined />}
        >
          {renderTreeNodes(node.children)}
        </Tree.TreeNode>
      );
    }
    return (
      <Tree.TreeNode
        title={<Typography.Text strong>{node.unitName}</Typography.Text>}
        key={node.id}
        icon={<ApartmentOutlined />}
      />
    );
  });
};

function _DepartmentChartOnly(props: DepartmentChartOnlyProps) {
  const { id } = props;
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitByIdParentQuery(
    { idParent: id! },
    {
      skip: !id
    }
  );
  return (
    <div className="DepartmentChartOnly">
      <Spin spinning={LoadingListUnit}>
        <Row>
          <Col span={24}>
            <Card>
              <Tree showIcon showLine>
                {renderTreeNodes(ListUnit?.listPayload ?? [])}
              </Tree>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export const DepartmentChartOnly = WithErrorBoundaryCustom(_DepartmentChartOnly);
