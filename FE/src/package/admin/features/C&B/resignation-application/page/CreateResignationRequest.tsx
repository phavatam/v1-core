import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Card, Col, Row } from "antd";
import { NewAndUpdateResignationRequest } from "@admin/features/C&B/resignation-application";
import { useNavigate, useParams } from "react-router-dom";

function _CreateResignationRequest() {
  const navigation = useNavigate();
  const { id } = useParams();
  console.log("1Id-_CreateResignationRequest: " + id);
  return (
    <div className="CreateInternRequest">
      <Row>
        <Col span={24}>
          <Card title="Tạo phiếu nghỉ việc" bordered={false}>
            <NewAndUpdateResignationRequest id={id} AfterSave={() => navigation("/admin/resignation-application")} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export const CreateResignationRequest = WithErrorBoundaryCustom(_CreateResignationRequest);
