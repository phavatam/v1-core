import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Card, Col, Row } from "antd";
import { NewAndUpdateResignationRequest } from "@admin/features/C&B/resignation-application";
import { useNavigate } from "react-router-dom";

function _CreateResignationRequest() {
  const navigation = useNavigate();
  return (
    <div className="CreateInternRequest">
      <Row>
        <Col span={24}>
          <Card title="Tạo phiếu nghỉ việc" bordered={false}>
            <NewAndUpdateResignationRequest AfterSave={() => navigation("/admin/MENU_YEU_CAU_THUC_TAP")} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export const CreateResignationRequest = WithErrorBoundaryCustom(_CreateResignationRequest);
