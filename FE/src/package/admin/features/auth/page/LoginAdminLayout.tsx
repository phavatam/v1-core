import { Button, Card, Col, Form, Image, Input, Layout, Row, Switch, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { setCookie } from "~/units";
import { useState } from "react";
import { LoginOutlined, MailOutlined, UnlockOutlined, AimOutlined } from "@ant-design/icons";
import { HandleError } from "@admin/components";
import { Illustration3 } from "@admin/asset/Illustrations";
import { useLoginMutation } from "@API/services/AuthApis.service";
import { InformationCompany } from "~/globalVariable";
import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { logoTachNen } from "@admin/asset/logo";

const { Header, Footer, Content } = Layout;

function _LoginAdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result] = useState<any>(null);
  const [login, { isLoading }] = useLoginMutation();
  const onFinish = async (values: { loginName: string; password: string }) => {
    try {
      values.loginName = "TamPV";
      values.password = "M@tkhau1";
      const result = await login({ user: values }).unwrap();
      const { from } = location.state || { from: "/admin/dashboard" };
      if (!result) return;
      if (result.isSuccess) {
        setCookie("jwt", result.data.accessToken, 1);
        return navigate(from);
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <Layout className="layout-default layout-signin" style={{ height: "100vh" }}>
      <Header>
        <div className="header-col header-brand" style={{ textAlign: "center" }}>
          <Image
            src={logoTachNen}
            alt="background"
            preview={false}
            width={150}
            style={{
              objectFit: "cover",
              margin: "auto",
              backgroundColor: JSON.parse(localStorage.getItem("setting")!).darkMode ? "white" : "transparent",
              padding: JSON.parse(localStorage.getItem("setting")!).darkMode ? "10px" : "0"
            }}
          />
        </div>
      </Header>
      <Content className="signin">
        <Row gutter={[24, 0]} justify="space-around">
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 7, offset: 2 }} md={{ span: 12 }}>
            <Card bordered={false} className="criclebox">
              <Typography.Title level={1}>Đăng nhập</Typography.Title>
              <Typography.Title
                style={{
                  color: "#8c8c8c",
                  fontWeight: 400,
                  marginBottom: 24
                }}
                level={5}
              >
                Nhập tài khoản
              </Typography.Title>
              <Form onFinish={onFinish} layout="vertical" className="row-col signIn-form" size={"large"}>
                <Form.Item
                  name="loginName"
                  style={{ fontWeight: 600 }}
                  hasFeedback
                  validateStatus={result ? (result.result === "success" ? "success" : "warning") : undefined}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên đăng nhập!"
                    }
                  ]}
                >
                  <Input placeholder="Login name" autoComplete="off" prefix={<AimOutlined />} />
                </Form.Item>

                <Form.Item
                  name="password"
                  style={{ fontWeight: 600 }}
                  hasFeedback
                  validateStatus={result ? (result.result === "success" ? "success" : "warning") : undefined}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu !"
                    }
                  ]}
                >
                  <Input.Password
                    type="Password"
                    placeholder="Mật khẩu"
                    prefix={<UnlockOutlined />}
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item>
                  <Switch
                    defaultChecked={true}
                    style={{
                      marginRight: 5
                    }}
                  />
                  Lưu mật khẩu
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={isLoading}
                    icon={<LoginOutlined />}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col className="sign-img" style={{ padding: 12 }} xs={24} lg={12} md={12}>
            <Image
              src={Illustration3}
              alt="background"
              preview={false}
              width={"100%"}
              style={{
                objectFit: "cover",
                margin: "auto"
              }}
            />
          </Col>
        </Row>
      </Content>
      <Footer>
        <p className="copyright">
          Copyright {InformationCompany.yearCopyRight} by <span>{InformationCompany.englishName}</span>.{" "}
        </p>
      </Footer>
    </Layout>
  );
}

export const LoginAdminLayout = WithErrorBoundaryCustom(_LoginAdminLayout);
