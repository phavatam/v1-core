import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Card, Col, Row, Spin, Tree, Typography } from "antd";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";
import { arrayToTree } from "@admin/features/unit";
import { UnitDTO } from "@models/unitDto";
import { ApartmentOutlined } from "@ant-design/icons";

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

function _DepartmentChart() {
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({ pageSize: 0, pageNumber: 0 });
  const data = arrayToTree(ListUnit?.listPayload ?? []);
  return (
    <div className="DepartmentChart">
      <Spin spinning={LoadingListUnit}>
        <Row
          style={{
            width: "calc(100vh - 64px)"
          }}
        >
          <Col span={24}>
            <Card>
              <Tree showIcon showLine>
                {renderTreeNodes(data)}
              </Tree>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export const DepartmentChart = WithErrorBoundaryCustom(_DepartmentChart);
