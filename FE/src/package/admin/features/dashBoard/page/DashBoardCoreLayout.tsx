import { Badge, Card, Col, Row, Skeleton, Spin, Typography } from "antd";
import { CompanyIntroduction } from "@admin/components";
import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import {
  BookOutlined,
  DeploymentUnitOutlined,
  NotificationOutlined,
  UserOutlined,
  MehTwoTone,
  SoundFilled,
  EyeTwoTone,
  ToolFilled,
  SketchCircleFilled,
  UnlockFilled
} from "@ant-design/icons";
import { ColumnChart } from "@admin/features/dashBoard/components/ColumnChart";
import {
  useGetAnalystHomeQuery,
  useGetListEvaluationsOfSupervisorQuery,
  useGetListEvaluationsOfUserQuery
} from "@API/services/EvaluationsApis.service";
import { useEffect, useState } from "react";
import Icon from "@ant-design/icons/lib/components/AntdIcon";

function _DashBoardCoreLayout() {
  const { Title } = Typography;

  const { data: dataAnalystHome, isLoading: LoadingAnalystHome } = useGetAnalystHomeQuery({
    idEvaluations: "LIST"
  });
  const { data: ListEvaluationsOfUser, isLoading: LoadingListEvaluationsOfUser } = useGetListEvaluationsOfUserQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListEvaluationsOfSupervisor, isLoading: LoadingListEvaluationsOfSupervisor } =
    useGetListEvaluationsOfSupervisorQuery({
      pageSize: 0,
      pageNumber: 0
    });

  const [dataChartsPending, setDataChartsPending] = useState<any[]>([]);
  const [dataChartsCompeted, setDataChartsCompeted] = useState<any[]>([]);

  useEffect(() => {
    if (dataAnalystHome) {
      const updatedDataChartsPending = dataAnalystHome?.payload.listAnalystEvaluationsPending.map((item) => ({
        type: `${item.nameEvaluations}/${item.unitName}`,
        value: item.totalEvaluationsPending
      }));
      const updatedDataChartsCompeted = dataAnalystHome?.payload.listAnalystEvaluationsCompleted.map((item) => ({
        type: `${item.nameEvaluations}/${item.unitName}`,
        value: item.totalEvaluationsCompleted
      }));
      setDataChartsPending(updatedDataChartsPending);
      setDataChartsCompeted(updatedDataChartsCompeted);
    }
  }, [dataAnalystHome]);

  const financeLayout = [
    ,
    {
      title: "Tạo đơn nghỉ việc",
      url: "/admin/resignation-application",
      icon: <SoundFilled />
    },
    {
      title: "Tạo đăng ký nghỉ phép",
      url: "/admin/resignation-application",
      icon: <MehTwoTone />
    },
    {
      title: "Tạo phiếu bổ sung dữ liệu quét thẻ",
      url: "/admin/resignation-application",
      icon: <UserOutlined />
    },
    {
      title: "Tạo đơn đăng ký tăng ca",
      url: "/admin/resignation-application",
      icon: <SketchCircleFilled />
    },
    {
      title: "Tạo kế hoạch ca",
      url: "/admin/resignation-application",
      icon: <ToolFilled />
    },
    {
      title: "Tạo đăng ký chuyển ca",
      url: "/admin/resignation-application",
      icon: <UnlockFilled />
    }
  ];

  return (
    <>
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          {financeLayout.map((item, index) => {
            return (
              <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
                <Card bordered={false} className="criclebox">
                  <div className="number">
                    <Skeleton active loading={LoadingAnalystHome}>
                      <Row align="middle" gutter={[24, 0]}>
                        <Col xs={5}>
                          <div className="icon-box">{item.icon}</div>
                        </Col>
                        <Col xs={18}>
                          <a style={{ color: "black" }} href={item.url}>
                            <span>{item.title}</span>
                          </a>
                        </Col>
                      </Row>
                    </Skeleton>
                  </div>
                </Card>
              </Col>
            );
          })}
          {/*<Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <Skeleton active loading={LoadingAnalystHome}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Tổng số phiếu đánh giá của đơn vị</span>
                      <Title level={3}>{dataAnalystHome?.payload.totalEvaluations}</Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">
                        <BookOutlined />
                      </div>
                    </Col>
                  </Row>
                </Skeleton>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <Skeleton active loading={LoadingAnalystHome}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Tổng số người dùng của đơn vị</span>
                      <Title level={3}>{dataAnalystHome?.payload.totalUser}</Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">
                        <UserOutlined />
                      </div>
                    </Col>
                  </Row>
                </Skeleton>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <Skeleton active loading={LoadingAnalystHome}>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>Tổng số đơn vị/phòng ban</span>
                      <Title level={3}>{dataAnalystHome?.payload.totalUnit}</Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">
                        <DeploymentUnitOutlined />
                      </div>
                    </Col>
                  </Row>
                </Skeleton>
              </div>
            </Card>
          </Col>*/}
        </Row>
      </div>
    </>
  );
}

export const DashBoardCoreLayout = WithErrorBoundaryCustom(_DashBoardCoreLayout);
