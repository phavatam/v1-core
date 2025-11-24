import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Card, Col, Row, Divider, Button, Flex, Badge, Space } from "antd";
import { NewAndUpdateResignationRequest } from "@admin/features/C&B/resignation-application";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "@API/services/UserApis.service";
import {
  UserOutlined,
  SmileOutlined,
  DoubleRightOutlined,
  MoreOutlined,
  CalendarOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { useState } from "react";

function _CreateResignationRequest() {
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const { data: user } = useGetUserQuery({ fetch: false });
  const navigation = useNavigate();
  const { id, item } = useParams();
  console.log("1Id-_CreateResignationRequest: " + id);
  const currentTime = new Date().toLocaleString();
  const referenceNumber = "RES-000002470-2025";
  console.log("checkdata", item);
  return (
    <div className="CreateInternRequest">
      {/*<Flex style={{ position: "sticky" }} align="flex-end" justify="flex-end">
        <Button type="primary" onClick={() => navigation("/admin/resignation-application")}>
          Quay lại
        </Button>
      </Flex>*/}
      <Row>
        <Col span={24}>
          <Card bordered={false}>
            <Row align="middle" gutter={16}>
              {/* Cột 1: Thông tin người dùng (Lớn) */}
              <Col flex="auto">
                <Flex align="center">
                  <span style={{ marginRight: 12 }}>
                    <FileTextOutlined style={{ fontSize: "24px" }} />
                  </span>
                  <p style={{ margin: 0 }}>{referenceNumber}</p>
                  <span style={{ marginRight: 12, marginLeft: 70 }}>
                    <UserOutlined style={{ fontSize: "24px" }} />
                  </span>
                  <p style={{ margin: 0 }}>{user?.data.fullName}</p>
                  <span style={{ marginRight: 12, marginLeft: 70 }}>
                    <CalendarOutlined style={{ fontSize: "24px" }} />
                  </span>
                  <p style={{ margin: 0 }}>{currentTime}</p>
                </Flex>
              </Col>

              {/* Cột 2: Icon ở cuối hàng (Nhỏ) */}
              <Col flex="50px">
                <Flex
                  vertical // <-- Sắp xếp các phần tử theo chiều dọc (trên-dưới)
                  align="center" // <-- Căn giữa các phần tử theo chiều ngang
                  justify="flex-start" // <-- Căn trên cùng (tùy chọn)
                  style={{ height: "100%" }} // <-- Đảm bảo Flex chiếm hết chiều cao Col
                >
                  {/* 1. Icon (sẽ ở trên cùng) */}
                  <MoreOutlined style={{ fontSize: "24px", color: "black", cursor: "pointer" }} />
                </Flex>
              </Col>
            </Row>
            <Row align="middle" gutter={16}>
              {/* Cột 1: Thông tin người dùng (Lớn) */}
              <Col flex="auto">
                <Flex align="center"></Flex>
              </Col>

              {/* Cột 2: Icon ở cuối hàng (Nhỏ) */}
              <Col flex="50px">
                <Flex
                  vertical // <-- Sắp xếp các phần tử theo chiều dọc (trên-dưới)
                  align="center" // <-- Căn giữa các phần tử theo chiều ngang
                  justify="flex-start" // <-- Căn trên cùng (tùy chọn)
                  style={{ height: "100%", width: "180%" }} // <-- Đảm bảo Flex chiếm hết chiều cao Col
                >
                  <a style={{ fontSize: "12px", marginTop: "4px", width: "150%" }}>
                    View More <DoubleRightOutlined />{" "}
                  </a>
                </Flex>
              </Col>
            </Row>
            <Divider />
            <NewAndUpdateResignationRequest id={id} AfterSave={() => navigation("/admin/resignation-application")} />
            <Divider />
          </Card>
        </Col>
      </Row>
      {/*<Divider />
      <Flex align="flex-end" justify="flex-end" style={{ marginTop: "20px" }}>
        <Button type="primary" onClick={() => navigation("/admin/resignation-application")}>
          Quay lại
        </Button>
      </Flex>*/}
    </div>
  );
}
export const CreateResignationRequest = WithErrorBoundaryCustom(_CreateResignationRequest);
