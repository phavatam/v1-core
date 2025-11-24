import { Button, Result } from "antd";
import React, { Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes, WithAuthorization } from "~/package/admin/routes";
import { RouteMapData, DefineRoutes } from "./route-data";
import { DashBoardCoreLayout, LoginAdminLayout, UserSetting } from "./list-componets-lazy-admin";
import { globalVariable } from "~/globalVariable";
import { Main } from "@admin/components";
import Loading from "@units/loading/loading";
import { useGetListNavigationByTokenQuery } from "@API/services/Navigation.service";
import { Navigation } from "@models/navigationDTO";
type MenuComponentMap = {
  [key: string]: React.ReactNode | React.FC<any>;
};

export function Home() {
  const { data, isLoading } = useGetListNavigationByTokenQuery({ pageNumber: 0, pageSize: 0 });
  const navigate = useNavigate();
  const path = useLocation();
  const menuComponentMap: MenuComponentMap = RouteMapData;

  const menuMap = data?.data?.map((item: any) => item.navigationsChild)?.flat() as Navigation[];
  if (isLoading || !menuMap) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          zIndex: "100",
          width: "100vw",
          height: "100vh",
          backgroundColor: JSON.parse(localStorage.getItem("setting")!).darkMode ? "#000000" : "#ffffff"
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "grid",
            placeItems: "center",
            zIndex: "100",
            width: "100vw",
            height: "100vh",
            backgroundColor: JSON.parse(localStorage.getItem("setting")!).darkMode ? "#000000" : "#ffffff"
          }}
        >
          <Loading />
        </div>
      }
    >
      {path.pathname.length === 1 ? (
        <Routes>
          <Route path={globalVariable.pathNameLogin} element={<PublicRoutes />}>
            <Route path={globalVariable.pathNameLogin} element={<LoginAdminLayout />} />
          </Route>
        </Routes>
      ) : path.pathname.includes("/Print") ? (
        <Routes>
          <Route path="/Print" element={<PrivateRoutes />}>
            <Route index path="/Print/PrintLibraryCard/:id" element={<></>} />
          </Route>
          <Route
            path="/Print-authorized-403"
            element={
              <Result
                status="403"
                title="403"
                subTitle="Xin lỗi, bạn không được phép truy cập trang này."
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      navigate(globalVariable.pathNameLogin, { state: { from: location.pathname } });
                    }}
                  >
                    Đăng nhập
                  </Button>
                }
              />
            }
          />
          {/* delete account succsess */}
          <Route
            path="/Print/user/setting/delete-account-success"
            element={
              <Result
                status="success"
                title="Bạn đã xóa tài khoản thành công"
                subTitle="Tài khoản và thông tin liên quan của bạn đã được xóa khỏi hệ thống. Vui lòng đặng nhập lại để sử dung"
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      navigate(globalVariable.pathNameLogin);
                    }}
                  >
                    Trở lại đăng nhập
                  </Button>
                }
              />
            }
          />
        </Routes>
      ) : (
        <Main>
          <Route path="/admin" element={<PrivateRoutes />}>
            <Route path="/admin/user/setting" element={<UserSetting />} />
            <Route
              index
              path="/admin/dashboard"
              element={
                <WithAuthorization requiredRole={"Trang chủ"}>
                  {/*<DashBoardLayout />*/}
                  <DashBoardCoreLayout />
                </WithAuthorization>
              }
            />
            {menuMap?.map((item) => {
              const Component = menuComponentMap[item.menuCode];
              return <Route path={item.path} element={Component as React.ReactNode} key={item.id} />;
            })}
          </Route>
          {DefineRoutes}
          {/* 404 not found */}
          <Route
            path="*"
            element={
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      navigate(globalVariable.pathNameLogin);
                    }}
                  >
                    Back Home
                  </Button>
                }
              />
            }
          />
          {/*403 not access*/}
          <Route
            path="/admin/403"
            element={
              <Result
                status="403"
                title="403"
                subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Quay lại
                  </Button>
                }
              />
            }
          />
        </Main>
      )}
    </Suspense>
  );
}
