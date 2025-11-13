import { Card, Col, Row, Typography } from "antd";
import { InformationCompany } from "~/globalVariable";
import { newLogoDPD } from "@admin/asset/logo";

export function CompanyIntroduction() {
  const { Title, Text, Paragraph } = Typography;
  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Row>
            <Col xs={24} md={12} sm={24} lg={12} xl={14} className="mobile-24">
              <div className="h-full col-content p-20">
                <div className="ant-muse">
                  <Text>Được xây dựng bởi các nhà phát triển</Text>
                  <Title level={5}>{InformationCompany.name}</Title>
                  <Paragraph className="lastweek mb-36">
                    Là công ty công nghệ chuyên gia công hệ thống phần mềm và các giải pháp chuyển đổi số.
                  </Paragraph>
                </div>
                <div className="card-footer">
                  <a className="icon-move-right" href="#pablo">
                    {/* Read More */}
                    {/* {<RightOutlined />} */}
                  </a>
                </div>
              </div>
            </Col>
            <Col
              xs={24}
              md={12}
              sm={24}
              lg={12}
              xl={10}
              className="col-img"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div className="ant-cret text-right">
                <img
                  src={newLogoDPD}
                  alt=""
                  className="border10"
                  style={{ objectFit: "cover", width: 120, height: 120 }}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={24} md={12} sm={24} lg={12} xl={10} className="mb-24">
        <Card bordered={false} className="criclebox card-info-2 h-full">
          <div className="gradent h-full col-content">
            <div className="card-content">
              <Title level={5}>Làm việc với những gì tốt nhất</Title>
              <p>Tạo ra các hệ thống tối ưu cho người dùng. Đó là niềm vinh dự của chúng tôi.</p>
            </div>
            {/*<div className="card-footer">*/}
            {/*  <a className="icon-move-right">*/}
            {/*     Read More */}
            {/*     <RightOutlined /> */}
            {/*  </a>*/}
            {/*</div>*/}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
