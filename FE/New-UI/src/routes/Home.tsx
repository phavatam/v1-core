import { Button, Result } from "antd";
import { Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { PrivateRoutes, PublicRoutes, WithAuthorization } from "../components/routes";
import {  LoginLayout} from "./list-componets-lazy-auth";
import { globalVariable } from "../globalVariable";
import { Main } from "../components/Main";
import Loading from "../utils/loading/loading";

export function Home() {
  const navigate = useNavigate();
  const path = useLocation();

  return (
    <Suspense
      fallback={
        <div>
          <Loading />
        </div>
      }
    >
      {path.pathname === '/' ? (
        <Routes>
          <Route path={globalVariable.pathNameLogin} element={<PublicRoutes />}>
            <Route path={globalVariable.pathNameLogin} element={<LoginLayout />} />
          </Route>
        </Routes>
      ) : 
      <Main>
          <Route path="/admin" element={<PrivateRoutes />}>
            <Route
              index
              path="/"
              element={
                <WithAuthorization requiredRole={"Trang chủ"}>
                  {/* <DashBoardCoreLayout /> */}
                </WithAuthorization>
              }
            />
            {/* {menuMap?.map((item) => {
              const Component = menuComponentMap[item.menuCode];
              return <Route path={item.path} element={Component as React.ReactNode} key={item.id} />;
            })} */}
          </Route>
          {/* {DefineRoutes} */}
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
        </Main>}
    </Suspense>
  );
}
